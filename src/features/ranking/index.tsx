import React from 'react'

import { Headline } from '@/components/common/headline'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard } from '@/components/player/card'

const RankingPage = () => {
  const rankings = [
    {
      rank: 1,
      points: 78991,
      name: 'カイル・ハイド',
      chara: 8,
    },
    {
      rank: 2,
      points: 64153,
      name: 'ドレックス',
      chara: 1,
    },
    {
      rank: 3,
      points: 58909,
      name: 'yun',
      chara: 8,
    },
  ]

  return (
    <div className="max-w-md mx-auto bg-gray-100 p-8 rounded shadow-lg">
      <Headline title="月間ランキング" />
      <div>
        <SmallHeadline title="現在のキャラクター構成比率" />
      </div>

      {/* Rankings */}
      <div className="mt-4 mb-4 space-y-2">
        {rankings.map((player, index) => (
          <PlayerCard player={player} key={index} />
        ))}
      </div>
    </div>
  )
}

export default RankingPage
