import { Headline } from '@/components/common/headline'
import { Shiny } from '@/components/common/shiny'
import { PlayerCard } from '@/components/player/card'
import type { PrefectureRanking } from '@/types/prefecture-ranking'

interface PrefectureRankingPageProps {
  ranking: PrefectureRanking[]
}

export const PrefectureRankingPage = ({ ranking }: PrefectureRankingPageProps) => {
  // 同率順位を計算
  const rankingsWithPosition = ranking.map((player, index) => {
    // 前のプレイヤーと都道府県数が同じなら同じ順位
    let rank = index + 1
    if (index > 0 && ranking[index - 1].prefecture_count === player.prefecture_count) {
      // 前のプレイヤーの順位を探す
      for (let i = index - 1; i >= 0; i--) {
        if (ranking[i].prefecture_count === player.prefecture_count) {
          rank = i + 1
        } else {
          break
        }
      }
    }
    return { ...player, rank }
  })

  const getRankingColor = (count: number) => {
    if (count >= 40) return 'shiny-rainbow'
    if (count >= 30) return 'shiny-gold'
    if (count >= 20) return 'shiny-silver'
    if (count >= 10) return 'shiny-copper'
    return 'shiny-none'
  }

  return (
    <>
      <Headline title="制県度ランキング" />
      <div className="bg-white text-center py-2 mb-2 rounded-lg">
        <span className="text-sm text-gray-600">
          最終更新: {new Date().toLocaleString('ja-JP')}
        </span>
      </div>

      <div className="mt-4 mb-4 space-y-2">
        {rankingsWithPosition.map((player, index) => (
          <PlayerCard
            player={{ name: player.player_name }}
            chara={player.chara ?? undefined}
            key={`${player.player_name}-${index}`}
          >
            <div className="flex items-center">
              <Shiny
                color={getRankingColor(player.prefecture_count)}
                className="rounded-lg border px-3"
              >
                <div className="text-xs text-gray-600">{player.rank}位</div>
              </Shiny>
              <div className="text-sm text-gray-600 ml-1">| {player.prefecture_count}都道府県</div>
            </div>
          </PlayerCard>
        ))}
      </div>
      {ranking.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          ランキングデータがありません（5都道府県以上でランクイン）
        </div>
      )}
    </>
  )
}
