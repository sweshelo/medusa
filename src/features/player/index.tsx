'use cache'

import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

import { AchievementView } from '@/components/achievement'
import { PointsLineChart } from '@/components/charts/line-chart'
import { Shiny } from '@/components/common/shiny'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard } from '@/components/player/card'
import { RecordsTable } from '@/components/records-table'
import { Revalidater } from '@/components/revalidater'
import { AverageToolTipIcon } from '@/components/tooltip/average'
import { DeviationToolTipIcon } from '@/components/tooltip/deviation'
import { fetchPlayerCount, fetchPlayerDeviationRanking } from '@/service/supabase/player'
import { Achievement } from '@/types/achievement'
import { Database } from '@/types/database.types'

interface PlayerPageProps {
  player: Database['public']['Tables']['player']['Row'] & {
    records: Database['public']['Tables']['record']['Row'][]
    maxPoints?: number
  }
  achievement?: Achievement
}

export const PlayerPage = async ({ player, achievement }: PlayerPageProps) => {
  cacheTag(player.name)
  const [digest] = player.records

  const count = await fetchPlayerCount()
  const index = await fetchPlayerDeviationRanking(player.name)
  console.log(count, index)
  const getColor = () => {
    if (!count || index === null) return 'shiny-white'
    if (index === 0) return 'shiny-rainbow'
    if (index / count < 0.01) return 'shiny-gold'
    if (index / count < 0.05) return 'shiny-silver'
    if (index / count < 0.1) return 'shiny-copper'
    return 'shiny-white'
  }

  return digest ? (
    <>
      <AchievementView achievement={achievement ?? digest.achievement} />
      <div className="py-3">
        <PlayerCard player={player} chara={digest.chara} />
      </div>
      <div className="relative">
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <Shiny
            className="rounded-lg p-2 shadow"
            color={(() => {
              switch (player.ranking) {
                case 1:
                  return 'shiny-rainbow'
                case 2:
                  return 'shiny-silver'
                case 3:
                  return 'shiny-copper'
                default:
                  return 'shiny-none'
              }
            })()}
          >
            <div className="flex flex-col px-1">
              <div className="">
                <p className="text-left text-xs">最高ランキング</p>
              </div>
              <div className="">
                <p className="text-right text-lg">{player.ranking && `${player.ranking}位`}</p>
              </div>
            </div>
          </Shiny>
          <Shiny className="rounded-lg p-2 shadow" color={getColor()} data-tooltip-id="deviation">
            <div className="flex flex-col px-1">
              <div className="flex justify-left gap-1">
                <p className="text-left text-xs">平均貢献P</p>
                <AverageToolTipIcon />
              </div>
              <div className="">
                <p className="text-right text-lg">{player.average ?? '-'}</p>
              </div>
            </div>
          </Shiny>
          <Shiny className="rounded-lg p-2 shadow" color={getColor()} data-tooltip-id="deviation">
            <div className="flex flex-col px-1">
              <div className="flex justify-left gap-1">
                <p className="text-left text-xs">全国偏差値</p>
                <DeviationToolTipIcon />
              </div>
              <div className="">
                <p className="text-right text-lg">{player.deviation_value ?? '-'}</p>
              </div>
            </div>
          </Shiny>
        </div>
      </div>
      <div className="my-4">
        <SmallHeadline title="貢献度の推移" />
        <PointsLineChart
          records={player.records.filter(
            record => record.diff && record.diff >= 50 && record.diff <= 500
          )}
        />
      </div>
      <Revalidater player={player.name} />
      <Revalidater player={'stats'} />
      <div className="my-4">
        <RecordsTable records={player.records} />
      </div>
    </>
  ) : (
    <>
      <div className="py-3">
        <div className="bg-white rounded-lg flex items-center shadow">
          <div className="w-[80px] h-[60px] rounded-l-lg bg-gray-300 flex items-center justify-center">
            <div className="text-center text-bold text-3xl">？</div>
          </div>
          <div className="ml-3 flex-grow">
            <div className="text-3xl font-bold">{player.name}</div>
          </div>
        </div>
      </div>
      <p className="text-center">このプレーヤーの有効な記録が存在しません。</p>
    </>
  )
}
