'use client'

import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

import { Chara } from '@/constants/chara'
import { Player } from '@/types/player'

interface RankingPieChartProps {
  ranking: Player[]
}

export const RankingPieChart = ({ ranking }: RankingPieChartProps) => {
  const [data, setData] = useState<
    {
      id: string
      name: string
      color: string
      count?: number
    }[]
  >([])

  useEffect(() => {
    const counts = ranking.reduce(acc => {
      const curr = 0 //acc.get(player.chara) || 0
      //return acc.set(player.chara, curr + 1)
      return acc.set('unknown', curr + 1)
    }, new Map<string, number>())

    setData(
      Object.entries(Chara)
        .map(([id, { name, color }]) => {
          return {
            id,
            name,
            color,
            count: counts.get(id),
          }
        })
        .filter(r => r.count && r.count > 0)
    )
  }, [setData, ranking])

  return data.length > 0 ? (
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
  ) : null
}
