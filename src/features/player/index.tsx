import { Achievement } from '@/components/achievement'
import { PointsLineChart } from '@/components/charts/line-chart'
import { Shiny } from '@/components/common/shiny'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard } from '@/components/player/card'
import { RecordsTable } from '@/components/records-table'
import { PlayerDetail } from '@/types/player'

interface PlayerPageProps {
  player: PlayerDetail
}

export const PlayerPage = ({ player }: PlayerPageProps) => {
  return (
    <>
      <Achievement achievement={player.achievement} />
      <div className="py-3">
        <PlayerCard player={player} />
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        <Shiny className="rounded-lg p-2 shadow" color="shiny-rainbow">
          <div className="flex flex-col px-1">
            <div className="">
              <p className="text-left text-xs">最高ランキング</p>
            </div>
            <div className="">
              <p className="text-right text-lg">1位</p>
            </div>
          </div>
        </Shiny>
        <div className="rounded-lg p-2 shadow bg-white">
          <div className="flex flex-col px-1">
            <div className="">
              <p className="text-left text-xs">最高貢献P</p>
            </div>
            <div className="">
              <p className="text-right text-lg">485</p>
            </div>
          </div>
        </div>
        <Shiny className="rounded-lg p-2 shadow" color="shiny-gold">
          <div className="flex flex-col px-1">
            <div className="">
              <p className="text-left text-xs">平均貢献P</p>
            </div>
            <div className="">
              <p className="text-right text-lg">204.018</p>
            </div>
          </div>
        </Shiny>
        <Shiny className="rounded-lg p-2 shadow" color="shiny-silver">
          <div className="flex flex-col px-1">
            <div className="">
              <p className="text-left text-xs">有効平均貢献P</p>
            </div>
            <div className="">
              <p className="text-right text-lg">209.90</p>
            </div>
          </div>
        </Shiny>
        <div className="rounded-lg p-2 shadow bg-white">
          <div className="flex flex-col px-1">
            <div className="">
              <p className="text-left text-xs">自己標準偏差</p>
            </div>
            <div className="">
              <p className="text-right text-lg">44.66</p>
            </div>
          </div>
        </div>
        <Shiny className="rounded-lg p-2 shadow" color="shiny-copper">
          <div className="flex flex-col px-1">
            <div className="">
              <p className="text-left text-xs">全国偏差値</p>
            </div>
            <div className="">
              <p className="text-right text-lg">62.52</p>
            </div>
          </div>
        </Shiny>
      </div>
      <div className="my-4">
        <SmallHeadline title="貢献度の推移" />
        <PointsLineChart records={player.records} />
      </div>
      <div className="my-4">
        <RecordsTable records={player.records} />
      </div>
    </>
  )
}
