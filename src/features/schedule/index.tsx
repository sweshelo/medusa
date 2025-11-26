import classNames from 'classnames'
import { format, isWithinInterval, parseISO } from 'date-fns'

import { fetchSchedule } from '@/service/supabase/schedule'

export const ScheduleTable = async () => {
  const schedule = await fetchSchedule()
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
          {schedule.slice(-4).map(table => {
            const isActiveTerm = isWithinInterval(new Date(), {
              start: parseISO(table.started_at!),
              end: parseISO(table.ended_at!),
            })
            return (
              <tr
                key={table.id}
                className={classNames({
                  ['bg-amber-200']: isActiveTerm,
                })}
              >
                <td className="text-center py-2 items-center gap-2 justify-center">
                  {format(table.started_at!, 'MM/dd')} ~ {format(table.ended_at!, 'MM/dd')}
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
