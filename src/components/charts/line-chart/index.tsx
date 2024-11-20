'use client'

import { format, parse } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Record as CCJRecord } from '@/types/record'

interface PointsLineChartProps {
  records: CCJRecord[]
}

export const PointsLineChart = ({ records }: PointsLineChartProps) => {
  const [avgs, setAvgs] = useState<{ date: string; avg: number }[]>([])
  const [min, setMin] = useState(50)
  const [max, setMax] = useState(50)

  useEffect(() => {
    // 日毎に分ける
    const grouped = records.reduce<
      Record<string, { total: number; counts: number; records: number[] }>
    >((acc, record) => {
      const date = format(new Date(record.datetime.date), 'yy/MM/dd')
      if (!acc[date]) acc[date] = { total: 0, counts: 0, records: [] }
      acc[date].total += record.diff
      acc[date].counts += 1
      acc[date].records.push(record.diff)
      return acc
    }, {})

    // 日毎の平均点を出す
    const result = Object.entries(grouped).map(([date, { total, counts }]) => ({
      date,
      avg: total / counts,
    }))

    setAvgs(result)
    setMin(Math.max(Math.min(...result.map(r => r.avg)) - 10, 50))
    setMax(Math.max(...result.map(r => r.avg)) + 10)
  }, [setAvgs, setMin, setMax, records])

  const formatter = useCallback((v: number) => {
    return v.toFixed(2)
  }, [])

  return avgs.length > 0 ? (
    <div className="bg-white my-2 sm:p-4 p-2 rounded-lg w-full h-[400px] w-[0] max-w-6xl mx-auto">
      <ResponsiveContainer width={'99%'} height={'100%'}>
        <LineChart data={avgs} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray={'3 3'} />
          <Line type="monotone" dataKey="avg" stroke="#8884d8" activeDot={{ r: 8 }} />
          <XAxis
            dataKey={'date'}
            fontSize={10}
            height={15}
            tickFormatter={(d: string) => format(parse(d, 'yy/MM/dd', new Date()), 'MM/dd')}
          />
          <YAxis
            dataKey={'avg'}
            min={min}
            fontSize={10}
            width={25}
            domain={[min, max]}
            tickFormatter={v => v.toFixed(0)}
          />
          <Tooltip formatter={formatter} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : null
}
