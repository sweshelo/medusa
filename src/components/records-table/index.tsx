import classNames from 'classnames'
import { format } from 'date-fns'

import { Record } from '@/types/record'

interface RecordsTableProps {
  records: Record[]
}

export const RecordsTable = ({ records }: RecordsTableProps) => {
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
            return (
              <tr
                key={index}
                className={classNames({
                  ['bg-gray-200']: !record.elapsed || record.elapsed! >= 600,
                })}
              >
                <td className="text-center py-2 flex items-center gap-2 justify-center">
                  {format(
                    new Date(
                      `${record.recorded_at ?? record.created_at.replace(/\+00:00$/, '-09:00')}+09:00`
                    ),
                    'yy/MM/dd HH:mm'
                  )}
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
