'use client'

import { TZDate, tz } from '@date-fns/tz'
import classNames from 'classnames'
import { format, isWithinInterval } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { Stage } from '@/components/stage-icon'
import type { RankRecord } from '@/types/record'
import type { DailyStats, Schedule } from './index'

const isValidRecord = (record: RankRecord) => {
  return record.elapsed && record.elapsed < 600 && record.diff !== null
}

// 日毎の統計を計算
const calculateDailyStats = (records: RankRecord[]): DailyStats => {
  const validDiffs = records.filter(isValidRecord).map((r) => r.diff ?? 0)
  const charaCount = new Map<string, number>()

  for (const record of records) {
    if (record.chara) {
      charaCount.set(record.chara, (charaCount.get(record.chara) || 0) + 1)
    }
  }

  const mostFrequentChara =
    [...charaCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null

  return {
    count: records.length,
    totalDiff: validDiffs.reduce((sum, d) => sum + d, 0),
    avgDiff:
      validDiffs.length > 0
        ? validDiffs.reduce((sum, d) => sum + d, 0) / validDiffs.length
        : 0,
    mostFrequentChara,
  }
}

// レコード詳細テーブルコンポーネント
const RecordsTable = ({
  records,
  schedule,
}: {
  records: RankRecord[]
  schedule: Schedule[]
}) => {
  const getStage = (date: Date) => {
    const term = schedule.find((s) => {
      if (!s.started_at) return false
      const start = new TZDate(s.started_at, 'Asia/Tokyo')
      const end = s.ended_at ? new TZDate(s.ended_at, 'Asia/Tokyo') : new Date()
      return isWithinInterval(date, { start, end })
    })

    return (date.getUTCHours() + 9) % 2 ? term?.even_time : term?.odd_time
  }

  return (
    <div className="overflow-x-auto shadow rounded">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-orange-300">
          <tr>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
              日時
            </th>
            <th className="px-0 py-3 text-xs font-medium uppercase tracking-wider text-center w-[60]">
              キャラ
            </th>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
              累計
            </th>
            <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
              推定
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => {
            const date = new TZDate(`${record.recorded_at}+09:00`)
            const stage = getStage(date)
            return (
              <tr
                key={record.id}
                className={classNames({
                  'bg-gray-200': !isValidRecord(record),
                })}
              >
                <td className="text-center py-2 flex items-center gap-2 justify-center">
                  <span>
                    {format(date, 'yy/MM/dd', { in: tz('Asia/Tokyo') })}
                  </span>
                  <span className="hidden md:inline">
                    {format(date, 'HH:mm', { in: tz('Asia/Tokyo') })}
                  </span>
                  {stage && <Stage name={stage} />}
                </td>
                <td>
                  <Image
                    src={
                      record.chara
                        ? `https://p.eagate.573.jp/game/chase2jokers/ccj/images/ranking/icon/ranking_icon_${record.chara}.png`
                        : 'https://eacache.s.konaminet.jp/game/chase2jokers/ccj/images/character/chara_image/icon/chara_icon_unbanned.png'
                    }
                    alt={''}
                    width={60}
                    height={40}
                    className="h-[40px]"
                    unoptimized
                  />
                </td>
                <td className="text-center">{record.point}P</td>
                <td className="text-center">
                  {record.diff !== null
                    ? `${Math.sign(record.diff) > 0 ? '+' : ''}${record.diff}`
                    : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface DailyRecordsSectionProps {
  date: string
  stats: DailyStats
  children: React.ReactNode
}

// 日別レコードセクションコンポーネント（クライアント）
export const DailyRecordsSection = ({
  date,
  stats,
  children,
}: DailyRecordsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* サマリー行: クリック可能 */}
      <tr
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer hover:bg-sky-100 transition-colors border-t border-gray-200 ${isOpen ? 'bg-sky-100' : ''}`}
      >
        <td className=" font-semibold text-gray-800 text-center">{date}</td>
        <td className=" text-sm text-gray-800 text-center">
          <strong>{stats.count}件</strong>
        </td>
        <td className=" text-sm text-gray-800 text-center">
          <strong>
            {stats.totalDiff > 0 ? '+' : ''}
            {stats.totalDiff}P
          </strong>
        </td>
        <td className=" text-sm text-gray-800 text-center">
          <strong>
            {stats.avgDiff > 0 ? '+' : ''}
            {stats.avgDiff.toFixed(1)}P
          </strong>
        </td>
        <td className=" text-center">
          {stats.mostFrequentChara ? (
            <Image
              src={`https://p.eagate.573.jp/game/chase2jokers/ccj/images/ranking/icon/ranking_icon_${stats.mostFrequentChara}.png`}
              alt={stats.mostFrequentChara}
              width={60}
              height={40}
              unoptimized
            />
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
      </tr>

      {/* 詳細行: 開閉可能 */}
      {isOpen && (
        <tr>
          <td colSpan={5} className="p-2">
            {children}
          </td>
        </tr>
      )}
    </>
  )
}

interface GaugeTableClientProps {
  groupedRecords: Map<string, RankRecord[]>
  schedule: Schedule[]
}

// クライアントコンポーネント
export const GaugeTableClient = ({
  groupedRecords,
  schedule,
}: GaugeTableClientProps) => {
  return (
    <div className="rounded-lg shadow-sm overflow-hidden bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-sky-300 border-b-2 border-sky-400">
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center text-gray-700">
              日付
            </th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center text-gray-700">
              試合数
            </th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center text-gray-700">
              合計
            </th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-center text-gray-700">
              平均
            </th>
            <th className="text-xs font-medium uppercase tracking-wider text-center text-gray-700 w-[60]">
              最頻
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from(groupedRecords.entries()).map(([date, dayRecords]) => {
            const stats = calculateDailyStats(dayRecords)
            return (
              <DailyRecordsSection key={date} date={date} stats={stats}>
                <RecordsTable records={dayRecords} schedule={schedule} />
              </DailyRecordsSection>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
