import { format } from 'date-fns'
import { GameResultTable } from '@/components/game-result/game-result-table'
import type { Tables } from '@/types/database.types'

type GameImage = Tables<'game_image'>
type Game = Tables<'game'>
type GameResult = Tables<'game_result'>

interface GameWithResults extends Game {
  game_result: GameResult[]
}

interface ImageHistoryItemProps {
  image: GameImage & {
    game: GameWithResults[]
  }
}

export const ImageHistoryItem = ({ image }: ImageHistoryItemProps) => {
  const hasGameData = image.game && image.game.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <details className="group">
        <summary className="p-4 cursor-pointer list-none">
          <div className="flex items-start gap-3">
            <div className="flex-1">
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
          </div>
        </summary>

        <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
          <div className="mt-4 space-y-4">
            {/* ゲーム情報とリザルト */}
            {hasGameData ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  ゲーム情報
                </h4>
                {image.game.map((game) => (
                  <div key={game.id} className="bg-white rounded p-3 space-y-3">
                    <div className="space-y-1 text-xs">
                      {game.game_result && game.game_result.length > 0 && (
                        <GameResultTable results={game.game_result} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded p-3 text-xs text-gray-500 text-center">
                紐づくゲームデータがありません
              </div>
            )}
          </div>
        </div>
      </details>
    </div>
  )
}
