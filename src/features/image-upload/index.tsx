'use client'

import imageCompression from 'browser-image-compression'
import * as exifr from 'exifr'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadProps {
  onUploadSuccess?: () => void
}

export const ImageUpload = ({ onUploadSuccess }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

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
      const file = e.target.files?.[0]
      if (!file) return

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        toast.error('画像ファイルを選択してください')
        return
      }

      // ファイルサイズチェック（2MB）
      if (file.size > 2 * 1024 * 1024) {
        toast.error('ファイルサイズは2MB以下にしてください')
        return
      }

      setSelectedFile(file)

      // プレビュー表示
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    },
    [],
  )

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    setUploading(true)

    try {
      // EXIF読み取り
      let takenAt: string | null = null
      try {
        const exifData = await exifr.parse(selectedFile)
        if (exifData?.DateTimeOriginal) {
          takenAt = new Date(exifData.DateTimeOriginal).toISOString()
        }
      } catch (exifError) {
        console.warn('Failed to read EXIF data:', exifError)
      }

      // 画像を読み込んで解像度チェック
      const img = new Image()
      const imageUrl = URL.createObjectURL(selectedFile)
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })
      URL.revokeObjectURL(imageUrl)

      let processedFile = selectedFile

      // 2000px超なら圧縮
      if (img.width > 2000 || img.height > 2000) {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        }
        processedFile = await imageCompression(selectedFile, options)
        toast.info('画像を圧縮しました')
      }

      // EXIF削除
      const blobWithoutExif = await removeExif(processedFile)
      const fileWithoutExif = new File([blobWithoutExif], processedFile.name, {
        type: 'image/jpeg',
      })

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

      toast.success('画像をアップロードしました')
      setSelectedFile(null)
      setPreview(null)

      // リセット
      const input = document.getElementById('image-input') as HTMLInputElement
      if (input) {
        input.value = ''
      }

      // 成功時のコールバック
      onUploadSuccess?.()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(
        error instanceof Error ? error.message : 'アップロードに失敗しました',
      )
    } finally {
      setUploading(false)
    }
  }, [selectedFile, removeExif, onUploadSuccess])

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4">
        <label
          htmlFor="image-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          画像を選択
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-sm file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">※ 2MB以下のJPEG/PNG画像</p>
      </div>

      {preview && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">プレビュー</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg border border-gray-300"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      )}
    </div>
  )
}
