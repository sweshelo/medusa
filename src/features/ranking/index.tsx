import React from 'react'

import { RankingPieChart } from '@/components/charts/pie-chart'
import { Headline } from '@/components/common/headline'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard } from '@/components/player/card'
import { Ranking } from '@/types/ranking'
import { Record } from '@/types/record'

interface RankingPageProps {
  ranking: (Ranking & { record?: Record })[]
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
          <PlayerCard player={player} chara={player.chara} ranking={player.rank} key={index}>
            <div className="text-sm text-gray-600 ml-1">
              {`| ${player.points}P`}
              <span className="border border-1 border-gray p-[1] px-2 m-1 rounded text-[10px]">
                <span
                  dangerouslySetInnerHTML={{
                    __html: player.achivement.markup || player.achivement.title,
                  }}
                />
              </span>
            </div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}

export default RankingPage
