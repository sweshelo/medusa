import { AchievementView } from '@/components/achievement'
import { PointsLineChart } from '@/components/charts/line-chart'
import { Shiny } from '@/components/common/shiny'
import { SmallHeadline } from '@/components/common/small-headline'
import { GaugeTable } from '@/components/gauge-table'
import { PlayerCard } from '@/components/player/card'
import { RankGauge } from '@/components/rank-gauge'
import { RecordsTable } from '@/components/records-table'
import { Revalidater } from '@/components/revalidater'
import { AverageToolTipIcon } from '@/components/tooltip/average'
import { DeviationToolTipIcon } from '@/components/tooltip/deviation'
import { PlayedPrefectureMap } from '@/features/prefecture-map'
import { getOniBorder } from '@/service/scraping/ranking'
import {
  fetchPlayerCount,
  fetchPlayerDeviationRanking,
} from '@/service/supabase/player'
import type { Achievement } from '@/types/achievement'
import type { Database } from '@/types/database.types'
import type { RankRecord } from '@/types/record'
import { getPlayerRankColor } from '@/utils/colors'

interface PlayerPageProps {
  player: Database['public']['Tables']['player']['Row'] & {
    records: Database['public']['Tables']['record']['Row'][]
    rankRecords: RankRecord[] | null
    maxPoints?: number
  }
  achievement?: Achievement
  timestamp: Date
}

export const PlayerPage = async ({
  player,
  achievement,
  timestamp,
}: PlayerPageProps) => {
  const [topRecord] = player.records
  const [topRankRecord] =
    player.rankRecords?.filter((r) => r.version === '2025-12-01') ?? []
  const digest = topRecord || topRankRecord

  const count = await fetchPlayerCount()
  const index = await fetchPlayerDeviationRanking(player.name)
  const border = await getOniBorder()
  const getColor = () => getPlayerRankColor(index, count ?? null)

  return digest ? (
    <>
      {achievement && <AchievementView achievement={achievement} />}
      <div className="py-3">
        <PlayerCard player={player} chara={digest.chara} />
      </div>
      <div className="relative">
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <Shiny
            className="rounded-lg p-2 shadow-sm"
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
                <p className="text-right text-lg">
                  {player.ranking && `${player.ranking}位`}
                </p>
              </div>
            </div>
          </Shiny>
          <Shiny
            className="rounded-lg p-2 shadow-sm"
            color={getColor()}
            data-tooltip-id="deviation"
          >
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
          <Shiny
            className="rounded-lg p-2 shadow-sm"
            color={getColor()}
            data-tooltip-id="deviation"
          >
            <div className="flex flex-col px-1">
              <div className="flex justify-left gap-1">
                <p className="text-left text-xs">全国偏差値</p>
                <DeviationToolTipIcon />
              </div>
              <div className="">
                <p className="text-right text-lg">
                  {player.deviation_value ?? '-'}
                </p>
              </div>
            </div>
          </Shiny>
        </div>
      </div>
      <Revalidater timestamp={timestamp} />
      {topRankRecord && player.rankRecords && player.rankRecords.length > 0 && (
        <div className="my-4">
          <SmallHeadline title="ランクゲージの推移" />
          <div className="my-4">
            <RankGauge value={topRankRecord.point} border={border} />
            <GaugeTable
              records={player.rankRecords
                .reverse()
                .map((record, index, self) => {
                  const prev = index > 0 ? self[index - 1] : null
                  return record.version === '2024-01-01'
                    ? {
                        ...record,
                        point: record.diff ?? 0,
                        diff:
                          prev?.diff && record.diff
                            ? record.diff - prev.diff
                            : null,
                      }
                    : record
                })
                .reverse()}
            />
          </div>
        </div>
      )}
      <div className="my-4">
        <PlayedPrefectureMap playerName={player.name} />
      </div>
      {/*
      <div className="my-4">
        <SmallHeadline title="貢献度の推移" />
        <PointsLineChart
          records={player.records.filter(
            (record) => record.diff && record.diff >= 50 && record.diff <= 500,
          )}
        />
      </div>
      <div className="my-4">
        <RecordsTable records={player.records} />
      </div>
      */}
    </>
  ) : (
    <>
      <div className="py-3">
        <div className="bg-white rounded-lg flex items-center shadow-sm">
          <div className="w-[80px] h-[60px] rounded-l-lg bg-gray-300 flex items-center justify-center">
            <div className="text-center text-bold text-3xl">？</div>
          </div>
          <div className="ml-3 grow">
            <div className="text-3xl font-bold">{player.name}</div>
          </div>
        </div>
      </div>
      <p className="text-center">このプレーヤーの有効な記録が存在しません。</p>
    </>
  )
}
