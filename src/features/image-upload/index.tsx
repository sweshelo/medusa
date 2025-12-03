'use client'

import imageCompression from 'browser-image-compression'
import * as exifr from 'exifr'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadProps {
  onUploadSuccess?: () => void
}

interface SelectedImage {
  id: string
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  error: string | null
}

export const ImageUpload = ({ onUploadSuccess }: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const removeExif = useCallback(async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          'image/jpeg',
          0.95,
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }

      img.src = url
    })
  }, [])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      const newImages: SelectedImage[] = []

      for (const file of files) {
        try {
          // ファイルタイプチェック
          if (!file.type.startsWith('image/')) {
            toast.error(`${file.name}: 画像ファイルを選択してください`)
            continue
          }

          // ファイルサイズチェック（10MB）
          if (file.size > 10 * 1024 * 1024) {
            toast.error(`${file.name}: ファイルサイズは10MB以下にしてください`)
            continue
          }

          // プレビュー生成
          const previewUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target?.result) {
                resolve(event.target.result as string)
              } else {
                reject(new Error('Failed to read file'))
              }
            }
            reader.onerror = () => {
              reject(new Error('Failed to load image file'))
            }
            reader.readAsDataURL(file)
          })

          newImages.push({
            id: uuidv4(),
            file,
            preview: previewUrl,
            uploading: false,
            uploaded: false,
            error: null,
          })
        } catch (error) {
          console.error('File select error:', error)
          toast.error(
            `${file.name}: ${error instanceof Error ? error.message : '画像の読み込みに失敗しました'}`,
          )
        }
      }

      if (newImages.length > 0) {
        setSelectedImages((prev) => [...prev, ...newImages])
        toast.success(`${newImages.length}枚の画像を追加しました`)
      }

      // input要素をリセット（同じファイルを再選択可能にする）
      e.target.value = ''
    },
    [],
  )

  const handleRemoveImage = useCallback((imageId: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId))
  }, [])

  const handleClearAll = useCallback(() => {
    setSelectedImages([])
  }, [])

  const uploadSingleImage = useCallback(
    async (image: SelectedImage) => {
      try {
        // 状態を「アップロード中」に更新
        setSelectedImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, uploading: true, error: null }
              : img,
          ),
        )

        // EXIF読み取り
        let takenAt: string | null = null
        try {
          const exifData = await exifr.parse(image.file)
          if (exifData?.DateTimeOriginal) {
            takenAt = new Date(exifData.DateTimeOriginal).toISOString()
          }
        } catch (exifError) {
          console.warn('Failed to read EXIF data:', exifError)
        }

        // 画像を読み込んで解像度チェック
        const img = new Image()
        const imageUrl = URL.createObjectURL(image.file)
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = imageUrl
        })
        URL.revokeObjectURL(imageUrl)

        let processedFile = image.file

        // 2000px超なら圧縮
        if (img.width > 2000 || img.height > 2000) {
          const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 2000,
            useWebWorker: true,
          }
          processedFile = await imageCompression(image.file, options)
        }

        // EXIF削除
        const blobWithoutExif = await removeExif(processedFile)
        const fileWithoutExif = new File(
          [blobWithoutExif],
          processedFile.name,
          {
            type: 'image/jpeg',
          },
        )

        // UUID生成
        const imageId = uuidv4()

        // アップロード
        const formData = new FormData()
        formData.append('file', fileWithoutExif)
        formData.append('imageId', imageId)
        if (takenAt) {
          formData.append('takenAt', takenAt)
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed')
        }

        // 成功
        setSelectedImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, uploading: false, uploaded: true }
              : img,
          ),
        )

        return true
      } catch (error) {
        console.error('Upload error:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'アップロードに失敗しました'

        setSelectedImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, uploading: false, error: errorMessage }
              : img,
          ),
        )

        return false
      }
    },
    [removeExif],
  )

  const handleUploadAll = useCallback(async () => {
    const imagesToUpload = selectedImages.filter((img) => !img.uploaded)
    if (imagesToUpload.length === 0) return

    setIsUploading(true)

    let successCount = 0
    let failCount = 0

    // 順次アップロード
    for (const image of imagesToUpload) {
      const success = await uploadSingleImage(image)
      if (success) {
        successCount++
      } else {
        failCount++
      }
    }

    setIsUploading(false)

    // 結果表示
    if (failCount === 0) {
      toast.success(`${successCount}枚の画像をアップロードしました`)
      // 成功時のコールバック
      onUploadSuccess?.()
      // アップロード済みの画像を削除
      setSelectedImages((prev) => prev.filter((img) => !img.uploaded))
    } else {
      toast.warning(
        `${successCount}枚成功、${failCount}枚失敗しました。失敗した画像を確認してください。`,
      )
      // 成功した画像のみ削除
      setSelectedImages((prev) =>
        prev.filter((img) => !img.uploaded || img.error),
      )
      if (successCount > 0) {
        onUploadSuccess?.()
      }
    }
  }, [selectedImages, uploadSingleImage, onUploadSuccess])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4">
        <label
          htmlFor="image-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          画像を選択（複数選択可能）
        </label>
        <div className="flex gap-2">
          <input
            id="image-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-sm file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {selectedImages.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-sm hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              すべてクリア
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          ※ 10MB以下のJPEG/PNG画像（アップロード時に自動圧縮されます）
        </p>
      </div>

      {selectedImages.length > 0 && (
        <div className="mb-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            選択済み画像（{selectedImages.length}枚）
          </p>
          <div className="space-y-2">
            {selectedImages.map((image) => (
              <div
                key={image.id}
                className={`border rounded-lg p-3 ${
                  image.error
                    ? 'border-red-300 bg-red-50'
                    : image.uploaded
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(image.file.size)}
                    </p>
                    {image.uploading && (
                      <p className="text-xs text-blue-600 mt-2">
                        アップロード中...
                      </p>
                    )}
                    {image.uploaded && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ アップロード完了
                      </p>
                    )}
                    {image.error && (
                      <p className="text-xs text-red-600 mt-2">{image.error}</p>
                    )}
                  </div>
                  {!image.uploaded && !image.uploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <title>削除</title>
                        <path d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImages.length > 0 && (
        <button
          type="button"
          onClick={handleUploadAll}
          disabled={
            isUploading ||
            selectedImages.every((img) => img.uploaded || img.uploading)
          }
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isUploading
            ? 'アップロード中...'
            : `${selectedImages.filter((img) => !img.uploaded).length}枚をアップロード`}
        </button>
      )}
    </div>
  )
}
