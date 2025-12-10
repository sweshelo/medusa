'use client'

import { TZDate } from '@date-fns/tz'
import { format, isWithinInterval } from 'date-fns'
import Image from 'next/image'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import { useGameData } from '@/hooks/game-data'
import { Stage } from '../stage-icon'
import type { GameResultWithImage } from './server'

interface GameRecordsTableProps {
  records: Array<GameResultWithImage>
}

const intToGameResult = (result: number) => {
  switch (result) {
    case 1:
      return '勝'
    case -1:
      return '負'
    case 0:
      return '引'
  }
}

const intToColorClass = (result: number) => {
  switch (result) {
    case 1:
      return 'text-amber-400 font-bold'
    case -1:
      return 'text-violet-900'
    case 0:
      return 'text-lime-500'
  }
}

export const GameRecordsTable = ({ records }: GameRecordsTableProps) => {
  const { schedule } = useGameData()
  const getStage = useCallback(
    (date: Date) => {
      const term = schedule.find((s) => {
        if (!s.started_at) return false
        const start = new TZDate(s.started_at, 'Asia/Tokyo')
        const end = s.ended_at
          ? new TZDate(s.ended_at, 'Asia/Tokyo')
          : new Date()
        return isWithinInterval(date, { start, end })
      })

      return (date.getUTCHours() + 9) % 2 ? term?.even_time : term?.odd_time
    },
    [schedule],
  )

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-orange-300">
          <tr>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              日時
            </th>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              P
            </th>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              キル
            </th>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              C
            </th>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              逃走
            </th>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              A
            </th>
            <th className="px-1 py-3 text-xs font-medium uppercase tracking-wider text-center">
              勝敗
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-gray-500 text-sm"
              >
                記録がありません
              </td>
            </tr>
          ) : (
            records.map((record) => {
              const date = record.played_at
                ? new TZDate(
                    `${record.played_at ?? record.image_created_at}`,
                    'Asia/Tokyo',
                  )
                : undefined
              const stage = date ? getStage(date) : undefined

              return (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50"
                  data-tooltip-id={`${record.id}`}
                >
                  <td className="text-center py-2 flex items-center gap-2 justify-center text-xs">
                    {date ? (
                      <>
                        <span className="">{format(date, 'yy/MM/dd')}</span>
                        <span className="hidden md:inline">
                          {format(date, 'HH:mm')}
                        </span>
                        {stage && <Stage name={stage} />}
                      </>
                    ) : (
                      <span className="text-sm text-gray-600">日時不明</span>
                    )}
                  </td>
                  <td className="text-center text-sm">
                    {record.score !== null
                      ? `${record.score.toLocaleString()}P`
                      : '-'}
                  </td>
                  <td className="text-center text-sm">
                    <span className="">{record.kill ?? '不明'}</span>
                  </td>
                  <td className="text-center text-xs">
                    <span className="">
                      {record.charge ? `${record.charge.toFixed(1)}%` : '不明'}
                    </span>
                    <br />
                    <span className="">
                      {record.chain ? `${record.chain}回` : '不明'}
                    </span>
                  </td>
                  <td className="text-center text-sm">
                    <span className="">{record.flight ?? '不明'}</span>
                  </td>
                  <td className="text-center text-sm">
                    <span className="">
                      {record.assist?.toFixed(1) ?? '不明'}
                    </span>
                  </td>
                  <td className="text-center">
                    {record.is_win !== null ? (
                      <span className={intToColorClass(record.is_win)}>
                        {intToGameResult(record.is_win)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  {record.image_path && (
                    <Tooltip id={`${record.id}`}>
                      <Image
                        src={record.image_path}
                        width={500}
                        height={300}
                        unoptimized
                        alt="ゲームリザルト画像"
                        className="max-w-[90vw] md:max-w-[600px] w-auto h-auto object-contain"
                      />
                    </Tooltip>
                  )}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
