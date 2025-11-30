import { Headline } from '@/components/common/headline'
import { Shiny } from '@/components/common/shiny'
import { SmallHeadline } from '@/components/common/small-headline'
import { PlayerCard } from '@/components/player/card'
import { Season } from '@/components/season'
import type { Ranking } from '@/types/ranking'
import type { Record } from '@/types/record'
import { getPlayerRankColor } from '@/utils/colors'

import { ScheduleTable } from '../schedule'

interface RankingPageProps {
  ranking: (Ranking & { record?: Record })[]
}
const RankingPage = ({ ranking }: RankingPageProps) => {
  return (
    <>
      <Headline title="月間ランキング" />
      <SmallHeadline title="スケジュール" />
      <ScheduleTable />
      <Season />
      <div className="mt-4 mb-4 space-y-2">
        {ranking.map((player, index) => (
          <PlayerCard
            player={player}
            chara={player.chara}
            key={`${player.rank}-${player.name}`}
          >
            <div className="flex items-center">
              <Shiny
                color={getPlayerRankColor(index, 100)}
                className="rounded-lg border px-3"
              >
                <div className="text-xs text-gray-600">{index + 1}位</div>
              </Shiny>
              <div className="text-sm text-gray-600 ml-1 truncate">
                {`| ${player.points}P`}
                <span className="min-w-0 mx-2 border border-gray p-[1] px-2 m-1 rounded-sm text-[10px] truncate">
                  <span
                    className="truncate"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: CCJ公式ランキングページに表示されたHTMLをレンダリングさせるため許容する 安全である前提
                    dangerouslySetInnerHTML={{
                      __html:
                        player.achievement.markup || player.achievement.title,
                    }}
                  />
                </span>
              </div>
            </div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}

export default RankingPage
