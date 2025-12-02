import { TZDate, tz } from '@date-fns/tz'
import classNames from 'classnames'
import { format, isWithinInterval } from 'date-fns'
import Image from 'next/image'
import { Stage } from '@/components/stage-icon'
import { fetchSchedule } from '@/service/supabase/schedule'
import type { RankRecord } from '@/types/record'
import { getRank } from '@/utils/rank'

interface RecordsTableProps {
  records: RankRecord[]
}

export const GaugeTable = async ({ records }: RecordsTableProps) => {
  const schedule = await fetchSchedule()
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
    <div className="overflow-x-auto rounded-lg shadow-sm">
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
          {records.slice(0, 100).map((record) => {
            const date = new TZDate(`${record.recorded_at}+09:00`)
            const stage = getStage(date)
            return (
              <tr
                key={record.id}
                className={classNames({
                  'bg-gray-200': !record.elapsed || record.elapsed >= 600,
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
