'use client'

import { format, parse } from 'date-fns'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'

import { Record as CCJRecord } from '@/types/record'

interface PointsLineChartProps {
  records: CCJRecord[]
}

export const PointsLineChart = ({ records }: PointsLineChartProps) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({})

  useEffect(() => {
    // 日毎に分ける
    const grouped = records.reduce<
      Record<string, { total: number; counts: number; records: number[] }>
    >((acc, record) => {
      console.log(record.datetime.date)
      const date = format(new Date(record.datetime.date), 'yy/MM/dd')
      if (!acc[date]) acc[date] = { total: 0, counts: 0, records: [] }
      acc[date].total += record.diff
      acc[date].counts += 1
      acc[date].records.push(record.diff)
      return acc
    }, {})

    // 日毎の平均点を出す
    const entries = Object.entries(grouped).map(([date, { total, counts, records }]) => ({
      date,
      avg: total / counts,
      max: Math.max(...records),
      min: Math.min(...records),
    }))

    const dates = entries.map(d => format(parse(d.date, 'yy/MM/dd', new Date()), 'MM/dd'))
    const averages = entries.map(d => d.avg)
    const maxes = entries.map(d => d.max)
    const mines = entries.map(d => d.min)

    setChartOptions({
      title: {
        text: undefined,
      },
      xAxis: {
        categories: dates,
        title: { text: '日付' },
      },
      yAxis: {
        title: { text: null, margin: 0 },
        labels: { reserveSpace: true },
      },
      chart: {
        spacing: [10, 10, 10, 0],
      },
      tooltip: {
        formatter: function () {
          return `日付: <b>${this.x}</b><br>貢献度: <b>${this.y?.toFixed(2)}</b>`
        },
      },
      series: [
        {
          name: '平均貢献度',
          data: averages,
          type: 'spline',
          color: '#8884d8',
        },
        {
          name: '最高貢献度',
          data: maxes,
          type: 'line',
          color: 'orange',
          visible: false,
        },
        {
          name: '最低貢献度',
          data: mines,
          type: 'line',
          color: 'blue',
          visible: false,
        },
      ],
    })
  }, [records])

  return chartOptions ? (
    <div className="bg-white my-2 sm:p-4 p-2 rounded-lg w-full max-w-6xl mx-auto">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  ) : null
}
