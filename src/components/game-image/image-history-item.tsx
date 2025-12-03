import { format } from 'date-fns'
import type { Tables } from '@/types/database.types'

type GameImage = Tables<'game_image'>

interface ImageHistoryItemProps {
  image: GameImage
}

export const ImageHistoryItem = ({ image }: ImageHistoryItemProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {image.url && (
        <img
          src={image.url}
          alt="Uploaded"
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">状態:</span>
          <span
            className={`px-2 py-1 rounded-sm text-xs font-semibold ${
              image.processed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {image.processed ? '処理済み' : '未処理'}
          </span>
        </div>
        {image.taken_at && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">撮影日時:</span>
            <span className="text-gray-800">
              {format(new Date(image.taken_at), 'yyyy/MM/dd HH:mm:ss')}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">アップロード:</span>
          <span className="text-gray-800">
            {format(new Date(image.created_at), 'yyyy/MM/dd HH:mm:ss')}
          </span>
        </div>
      </div>
    </div>
  )
}
