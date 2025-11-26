import React from 'react'

import { Headline } from '@/components/common/headline'
import { PlayerCard } from '@/components/player/card'
import { PlayCountRanking } from '@/service/supabase/play-count'
import { Season } from '@/service/supabase/season'

interface PlayCountRankingPageProps {
  ranking: PlayCountRanking[]
  season: Season | null
  timestamp: Date
}

const PlayCountRankingPage = ({ ranking, season, timestamp }: PlayCountRankingPageProps) => {
  return (
    <>
      <Headline title="プレイ数ランキング" />
      {season && (
        <div className="bg-white text-center py-2 mb-2 rounded-lg">
          <span className="text-sm text-gray-600">
            シーズン{season.number}（{new Date(season.started_at).toLocaleDateString('ja-JP')}
            〜）のプレイ数ランキングです
            <br />
            最終更新: {timestamp.toLocaleString('ja-JP')}
          </span>
        </div>
      )}
      <div className="mt-4 mb-4 space-y-2">
        {ranking.map((player, index) => (
          <PlayerCard
            player={{ name: player.player_name }}
            chara={player.chara}
            key={player.player_name}
          >
            <div className="flex">
              <div className="text-sm text-gray-600">{index + 1}位</div>
              <div className="text-sm text-gray-600 ml-1 truncate">
                {`| ${player.play_count}プレイ`}
                <span className="min-w-0 mx-2 border border-1 border-gray p-[1] px-2 m-1 rounded text-[10px] truncate">
                  <span className="truncate">{player.achievement}</span>
                </span>
              </div>
            </div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}

export default PlayCountRankingPage
