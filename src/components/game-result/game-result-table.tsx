import type { Tables } from '@/types/database.types'

type GameResult = Tables<'game_result'>

interface GameResultTableProps {
  results: GameResult[]
}

const intToGameResult = (result: number) => {
  switch (result) {
    case 1:
      return '勝'
    case -1:
      return '負'
    case 0:
      return '引'
  }
}

const intToColorClass = (result: number) => {
  switch (result) {
    case 1:
      return 'text-amber-400 font-bold'
    case -1:
      return 'text-violet-900'
    case 0:
      return 'text-lime-500'
  }
}

export const GameResultTable = ({ results }: GameResultTableProps) => {
  if (results.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        ゲーム結果がありません
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1 text-left">
              プレイヤー
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              貢献度
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">K</th>
            <th className="border border-gray-300 px-2 py-1 text-center">D</th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              アシスト
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              チェイン
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              ジュウデン
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              逃走
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              勝敗
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              チーム
            </th>
            <th className="border border-gray-300 px-2 py-1 text-center">
              MVP
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className={result.is_you ? 'bg-blue-50' : 'bg-white'}
            >
              <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                {result.player_name || '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-right">
                {result.score !== null ? result.score.toLocaleString() : '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.kill ?? '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.death ?? '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.assist ?? '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.chain ?? '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.charge ?? '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.flight ?? '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.is_win !== null ? (
                  <span className={intToColorClass(result.is_win)}>
                    {intToGameResult(result.is_win)}
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.team !== null ? (
                  <span
                    className={`inline-block w-4 h-4 rounded-full ${
                      result.team ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  />
                ) : (
                  '-'
                )}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {result.is_mvp ? (
                  <span className="text-yellow-500 font-bold">★</span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
