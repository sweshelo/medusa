import classNames from 'classnames'
import { differenceInDays, format } from 'date-fns'

import { fetchAllSeasons } from '@/service/supabase/season'

export const Season = async () => {
  const seasons = await fetchAllSeasons()

  if (!seasons || seasons.length === 0) {
    return (
      <div className="rounded-lg shadow p-6 bg-white my-4">
        <p className="text-gray-500 text-center">シーズン情報を取得できませんでした</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow my-4">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg">
        <thead className="bg-orange-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              シーズン
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              開始日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              終了日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">
              日数
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {seasons.map(season => {
            const isCurrentSeason = !season.ended_at
            const days = isCurrentSeason
              ? differenceInDays(new Date(), new Date(season.started_at))
              : differenceInDays(new Date(season.ended_at!), new Date(season.started_at))

            return (
              <tr
                key={season.id}
                className={classNames({
                  ['bg-amber-200']: isCurrentSeason,
                })}
              >
                <td className="text-center py-2 items-center gap-2 justify-center">
                  Season {season.number}
                </td>
                <td className="text-center py-2 items-center gap-2 justify-center">
                  {format(new Date(season.started_at), 'yy/MM/dd')}
                </td>
                <td className="text-center py-2 items-center gap-2 justify-center">
                  {season.ended_at ? format(new Date(season.ended_at), 'yy/MM/dd') : '-'}
                </td>
                <td className="text-center py-2 items-center gap-2 justify-center">{days}日</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
