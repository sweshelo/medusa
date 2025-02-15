import React from 'react'

import { Headline } from '@/components/common/headline'
import { PlayerCard } from '@/components/player/card'
import { Player } from '@/types/player'
import { Record } from '@/types/record'

interface RankingPageProps {
  ranking: (Player & {
    record: Record
  })[]
}

const DeviationRankingPage = ({ ranking }: RankingPageProps) => {
  return (
    <>
      <Headline title="偏差値ランキング" />
      <div className="mt-4 mb-4 space-y-2">
        {ranking.map((player, index) => (
          <PlayerCard player={player} chara={player.record.chara} ranking={index + 1} key={index}>
            <div className="text-sm text-gray-600 ml-1">{`| ${player.deviation_value}`}</div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}

export default DeviationRankingPage
