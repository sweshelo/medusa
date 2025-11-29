'use client'

import { Shiny } from '@/components/common/shiny'

interface ConquestBarProps {
  played: number
  total: number
  rate: number
}

/**
 * 制覇度に応じた色を決定
 */
const getConquestColor = (rate: number): string => {
  if (rate >= 100) return 'shiny-rainbow' // 完全制覇（100%以上）
  if (rate >= 80) return 'shiny-gold' // 80%以上
  if (rate >= 60) return 'shiny-silver' // 60%以上
  return 'shiny-copper' // 40%未満
}

/**
 * 制覇度を示すプログレスバー
 */
export const ConquestBar = ({ played, total, rate }: ConquestBarProps) => {
  // 100%を超える場合は視覚的に100%に制限
  const displayRate = Math.min(rate, 100)
  const color = getConquestColor(rate)

  return (
    <div className="w-full my-1 px-3">
      <div className="relative h-5 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* プログレスバー部分にShinyエフェクトを適用 */}
        <div
          className="absolute h-full transition-all duration-500"
          style={{ width: `${displayRate}%` }}
        >
          <Shiny color={color} className="h-full">
            <div className="h-full" />
          </Shiny>
        </div>
        {/* テキストを最前面に配置 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-md font-bold text-gray-800 leading-none inline-flex items-center">
            <small className="text-[12px] text-gray-600">現在稼働中の </small>
            <span className="px-1">{played}</span>
            <small className="text-[12px] text-gray-600"> / {total} 都道府県 でプレイ済み</small>
          </span>
        </div>
      </div>
    </div>
  )
}
