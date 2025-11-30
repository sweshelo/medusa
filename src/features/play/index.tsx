import { Headline } from '@/components/common/headline'
import { Shiny } from '@/components/common/shiny'
import { PlayerCard } from '@/components/player/card'
import type { PlayCountRanking } from '@/service/supabase/play-count'
import type { Season } from '@/service/supabase/season'
import { getPlayerRankColor } from '@/utils/colors'

interface PlayCountRankingPageProps {
  ranking: PlayCountRanking[]
  season: Season | null
  timestamp: Date
}

const PlayCountRankingPage = ({
  ranking,
  season,
  timestamp,
}: PlayCountRankingPageProps) => {
  return (
    <>
      <Headline title="プレイ数ランキング" />
      {season && (
        <div className="bg-white text-center py-2 mb-2 rounded-lg">
          <span className="text-sm text-gray-600">
            シーズン{season.number}（
            {new Date(season.started_at).toLocaleDateString('ja-JP')}
            〜）のプレイ数ランキングです
            <br />
            最終更新: {timestamp.toLocaleString('ja-JP')}
          </span>
        </div>
      )}
      <div className="mt-4 mb-4 space-y-2">
        {ranking.length > 0 ? (
          ranking.map((player, index) => (
            <PlayerCard
              player={{ name: player.player_name }}
              chara={player.chara}
              key={player.player_name}
            >
              <div className="flex items-center">
                <Shiny
                  color={getPlayerRankColor(index, 50)}
                  className="rounded-lg border px-3"
                >
                  <div className="text-xs text-gray-600">{index + 1}位</div>
                </Shiny>
                <div className="text-sm text-gray-600 ml-1 truncate">
                  {`| ${player.play_count}プレイ`}
                </div>
              </div>
            </PlayerCard>
          ))
        ) : (
          <p>ランキング情報の取得に失敗しました</p>
        )}
      </div>
    </>
  )
}

export default PlayCountRankingPage
