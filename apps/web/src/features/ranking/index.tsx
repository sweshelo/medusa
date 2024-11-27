import React from 'react'

import { RankingPieChart } from '../../components/charts/pie-chart'
import { Headline } from '../../components/common/headline'
import { SmallHeadline } from '../../components/common/small-headline'
import { PlayerCard } from '../../components/player/card'
import { Ranking } from '../../types/ranking'

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
