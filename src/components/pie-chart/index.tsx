'use client'

import { Cell, Pie, PieChart } from 'recharts'

import { Player } from '@/app/types/player'
import { Chara } from '@/constants/chara'

interface RankingPieChartProps {
  ranking: Player[]
}

export const RankingPieChart = ({ ranking }: RankingPieChartProps) => {
  const counts = ranking.reduce((acc, player) => {
    const curr = acc.get(player.chara) || 0
    return acc.set(player.chara, curr + 1)
  }, new Map<string, number>())

  const data = Object.entries(Chara)
    .map(([id, { name, color }]) => {
      return {
        id,
        name,
        color,
        count: counts.get(id),
      }
    })
    .filter(r => r.count && r.count > 0)

  return (
    <PieChart width={350} height={210}>
      <Pie
        data={data}
        cx={175}
        cy={100}
        innerRadius={50}
        outerRadius={75}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="count"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  )
}
