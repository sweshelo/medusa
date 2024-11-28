import { RankingPieChart } from '@shared/components/charts/pie-chart'
import { Headline } from '@shared/components/common/headline'
import { SmallHeadline } from '@shared/components/common/small-headline'
import { PlayerCard } from '@shared/components/player/card'
import { Ranking } from '@shared/types/ranking'
import React from 'react'

interface RankingPageProps {
  ranking: Ranking[]
}
const RankingPage = ({ ranking }: RankingPageProps) => {
  return (
    <>
      <Headline title="月間ランキング" />
      <div>
        <SmallHeadline title="現在のキャラクター構成比率" />
        <div className="flex justify-center bg-white my-2 rounded-lg">
          <RankingPieChart ranking={ranking} />
        </div>
      </div>

      <div className="mt-4 mb-4 space-y-2">
        {ranking.map((player, index) => (
          <PlayerCard player={player} chara={player.chara} ranking={player.rank} key={index} />
        ))}
      </div>
    </>
  )
}

export default RankingPage
