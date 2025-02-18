import { tz, TZDate } from '@date-fns/tz'
import classNames from 'classnames'
import { format, isWithinInterval } from 'date-fns'

import { Stage } from '@/components/stage-icon'
import { fetchSchedule } from '@/service/supabase/schedule'
import { Record } from '@/types/record'

interface RecordsTableProps {
  records: Record[]
}

export const RecordsTable = async ({ records }: RecordsTableProps) => {
  const schedule = await fetchSchedule()
  const getStage = (date: Date) => {
    const term = schedule.find(s => {
      const start = new TZDate(s.started_at!, 'Asia/Tokyo')
      const end = new TZDate(s.ended_at!, 'Asia/Tokyo')
      return isWithinInterval(date, { start, end })
    })

    return (date.getUTCHours() + 9) % 2 ? term?.even_time : term?.odd_time
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-orange-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              累計
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              推定
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.slice(0, 100).map((record, index) => {
            const date = new TZDate(
              `${record.recorded_at ?? record.created_at.replace(/\+00:00$/, '-09:00')}+09:00`
            )
            const stage = getStage(date)
            return (
              <tr
                key={index}
                className={classNames({
                  ['bg-gray-200']: !record.elapsed || record.elapsed! >= 600,
                })}
              >
                <td className="text-center py-2 flex items-center gap-2 justify-center">
                  <span>{format(date, 'yy/MM/dd', { in: tz('Asia/Tokyo') })}</span>
                  <span className="hidden md:inline">
                    {format(date, 'HH:mm', { in: tz('Asia/Tokyo') })}
                  </span>
                  {stage && <Stage name={stage} />}
                </td>
                <td className="text-center">{record.point}P</td>
                <td className="text-center">{record.diff}P</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
