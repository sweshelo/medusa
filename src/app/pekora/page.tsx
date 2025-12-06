'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Headline } from '@/components/common/headline'
import { SmallHeadline } from '@/components/common/small-headline'
import { ImageHistoryItem } from '@/components/game-image/image-history-item'
import { ImageUpload } from '@/features/image-upload'
import type { Tables } from '@/types/database.types'
import { getUploadedImages } from './actions'

type GameImage = Tables<'game_image'>
type Game = Tables<'game'>
type GameResult = Tables<'game_result'>

interface GameWithResults extends Game {
  game_result: GameResult[]
}

type ImageWithGame = GameImage & {
  game: GameWithResults[]
}

export default function PekoraPage() {
  const [images, setImages] = useState<ImageWithGame[]>([])
  const [loading, setLoading] = useState(true)

  const fetchImages = useCallback(async () => {
    const result = await getUploadedImages()
    if (result.images) {
      setImages(result.images)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchImages()
  }, [fetchImages])

  const handleUploadSuccess = useCallback(() => {
    fetchImages()
  }, [fetchImages])

  return (
    <div className="container mx-auto">
      <Headline title="画像記録機能 (β)" />
      <div className="bg-white rounded-lg py-3 px-1 text-gray-600 text-sm text-center">
        <p>アップロードされた画像から試合のリザルトを分析します</p>
        <p>処理済みの画像をクリックすると分析結果を表示します</p>
        <p>プレイヤーページで一覧を確認できます</p>
      </div>

      <div className="text-sm text-center border-1 border-amber-200 bg-amber-100 rounded-lg my-2 p-2 text-gray-600">
        この機能は現在試験運用中です。
        <br />
        アップロードした画像の取り下げ機能が今後実装予定です。
        <br />
        この機能をご利用になる場合、宜しければ
        <Link href={'/donation'} className="underline text-blue-600 px-1">
          寄付
        </Link>
        もご検討下さい。
      </div>

      <div className="max-w-3xl mx-auto space-y-8 mt-6">
        {/* アップロードフォーム */}
        <section>
          <SmallHeadline title="新規アップロード" />
          <div className="text-sm text-center border-1 border-red-200 bg-red-100 rounded-lg my-2 p-2 font-bold text-gray-800">
            短時間で大量の画像(100枚程度)をアップロードした場合、アカウントを凍結します
            <br />
            常識の範囲内でご利用下さい
          </div>

          <ImageUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        {/* アップロード履歴 */}
        <section>
          <SmallHeadline title="アップロード履歴" />
          {loading ? (
            <div className="bg-white rounded-lg p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              アップロードされた画像がありません
            </div>
          ) : (
            <div className="space-y-4">
              {images.map((image) => (
                <ImageHistoryItem
                  key={image.id}
                  image={image}
                  onUpdate={fetchImages}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
