import { getRank, getRankColor } from '@/utils/rank'
import { Shiny } from '../common/shiny'

interface RankGaugeProps {
  value: number
}

export const RankGauge = ({ value }: RankGaugeProps) => {
  const rank = getRank(value)
  const color = getRankColor(rank)
  const sValue = value > 1400 ? value - 1300 : undefined

  return (
    <div className="flex items-center gap-3 py-2 px-4 my-3 rounded-sm shadow-sm bg-white">
      {/* ランク表示部分 - テキスト幅に応じて自動調整 */}
      <div className="flex-shrink-0 font-bold text-lg mx-2">ランク {rank}</div>

      {/* ゲージ部分 - 残りの幅を使用 */}
      <div className="flex-1 relative h-6 bg-gray-200 overflow-hidden shadow-inner">
        {/* プログレスバー部分にShinyエフェクトを適用 */}
        <div
          className="absolute h-full transition-all duration-500"
          style={{ width: `${sValue ? 100 : value % 100}%` }}
        >
          <Shiny color={color} className="h-full">
            <div className="h-full" />
          </Shiny>
        </div>

        {/* sValue表示 - ゲージの右上に小さく重ねて表示 */}
        {sValue !== undefined && (
          <div className="absolute top-[-5px] right-1 text-xs font-semibold text-gray-700 leading-6">
            {sValue}
          </div>
        )}
      </div>
    </div>
  )
}
