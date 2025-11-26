import classNames from 'classnames'
import { format, isWithinInterval, parseISO } from 'date-fns'

import { fetchSchedule } from '@/service/supabase/schedule'

export const ScheduleTable = async () => {
  const schedule = await fetchSchedule()

  // 現在アクティブな期間を見つける
  const currentIndex = schedule.findIndex(table =>
    isWithinInterval(new Date(), {
      start: parseISO(table.started_at!),
      end: parseISO(table.ended_at!),
    })
  )

  // 表示する範囲を決定（現在の期間の前後1件ずつ）
  let displaySchedule
  if (currentIndex !== -1) {
    // 現在の期間が見つかった場合
    const startIndex = Math.max(0, currentIndex - 1)
    const endIndex = Math.min(schedule.length, currentIndex + 2)
    displaySchedule = schedule.slice(startIndex, endIndex)
  } else {
    // 現在の期間が見つからない場合は最後の3件を表示
    displaySchedule = schedule.slice(-3)
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow my-4">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg">
        <thead className="bg-orange-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              日付
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              偶数
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              奇数
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displaySchedule.map(table => {
            const isActiveTerm =
              table.started_at &&
              table.ended_at &&
              isWithinInterval(new Date(), {
                start: parseISO(table.started_at),
                end: parseISO(table.ended_at),
              })
            return (
              <tr
                key={table.id}
                className={classNames({
                  ['bg-amber-200']: isActiveTerm,
                })}
              >
                <td className="text-center py-2 items-center gap-2 justify-center">
                  {table.started_at ? format(table.started_at, 'MM/dd') : ''} ~{' '}
                  {table.ended_at ? format(table.ended_at, 'MM/dd') : ''}
                </td>
                <td className="text-center py-2 items-center gap-2 justify-center">
                  {table.even_time}
                </td>
                <td className="text-center py-2 items-center gap-2 justify-center">
                  {table.odd_time}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
