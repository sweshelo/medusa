import React from 'react'

import { Player } from '@/app/types/player'
import { Headline } from '@/components/common/headline'
import { SmallHeadline } from '@/components/common/small-headline'
import { RankingPieChart } from '@/components/pie-chart'
import { PlayerCard } from '@/components/player/card'

interface RankingPageProps {
  ranking: Player[]
}
const RankingPage = ({ ranking }: RankingPageProps) => {
  return (
    <div className="max-w-lg mx-auto bg-cyan-50 p-4 sm:p-8 rounded-lg shadow-2xl">
      <Headline title="月間ランキング" />
      <div>
        <SmallHeadline title="現在のキャラクター構成比率" />
        <div className="flex justify-center bg-white my-2 rounded-lg">
          <RankingPieChart ranking={ranking} />
        </div>
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
