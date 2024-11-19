import React from 'react'

import { Player } from '@/app/types/player'
import { Headline } from '@/components/common/headline'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard } from '@/components/player/card'

interface RankingPageProps {
  ranking: Player[]
}
const RankingPage = ({ ranking }: RankingPageProps) => {
  return (
    <div className="max-w-md mx-auto bg-gray-100 p-8 rounded shadow-lg">
      <Headline title="月間ランキング" />
      <div>
        <SmallHeadline title="現在のキャラクター構成比率" />
      </div>

      <div className="mt-4 mb-4 space-y-2">
        {ranking.map((player, index) => (
          <PlayerCard player={player} key={index} />
        ))}
      </div>
    </div>
  )
}

export default RankingPage
