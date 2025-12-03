import type { Border } from '@/service/scraping/oni-border'
import { getRank, getRankColor } from '@/utils/rank'
import { Shiny } from '../common/shiny'

interface RankGaugeProps {
  value: number
  border: Border
}

export const RankGauge = ({ value, border }: RankGaugeProps) => {
  const rank = getRank(value)
  const color = getRankColor(rank)
  const sValue = value > 1400 ? value - 1300 : undefined
  const isOni = border?.top !== undefined ? value >= border.top : false

  console.log(isOni, border)

  return (
    <div
      className={`rounded-sm shadow-sm ${isOni ? 'bg-red-300' : 'bg-white'} py-2 my-3`}
    >
      {border &&
        (isOni
          ? border.bottom !== undefined && (
              <p className="text-center text-sm pb-1">
                S降格まで あと {border.bottom - value}{' '}
                <span className="text-gray-600 text-[10px]">(推定値)</span>
              </p>
            )
          : border.top !== undefined && (
              <p className="text-center text-sm pb-1">
                鬼ランクまで あと {border.top - value}{' '}
                <span className="text-gray-600 text-[10px]">(推定値)</span>
              </p>
            ))}
      <div className="flex items-center gap-3 px-4">
        {/* ランク表示部分 - テキスト幅に応じて自動調整 */}
        {isOni ? (
          <>
            <div className="flex-shrink-0 font-bold mx-2">
              <span className="text-xs">推定ランク</span>{' '}
              <span className="text-red-900 text-xl">鬼</span>
            </div>
          </>
        ) : (
          <div className="flex-shrink-0 font-bold text-lg mx-2">
            ランク {rank}
          </div>
        )}
        {/* ゲージ部分 - 残りの幅を使用 */}
        <div className="flex-1 relative h-6 bg-gray-200 overflow-hidden shadow-inner">
          {/* プログレスバー部分にShinyエフェクトを適用 */}
          <div
            className="absolute h-full transition-all duration-500"
            style={{ width: `${sValue ? 100 : value % 100}%` }}
          >
            <Shiny color={isOni ? 'shiny-rainbow' : color} className="h-full">
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
    </div>
  )
}
