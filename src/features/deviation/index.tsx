import { Headline } from '@/components/common/headline'
import { Shiny } from '@/components/common/shiny'
import { PlayerCard } from '@/components/player/card'
import { fetchPlayerCount } from '@/service/supabase/player'
import type { Player } from '@/types/player'
import type { Record } from '@/types/record'
import { getPlayerRankColor } from '@/utils/colors'

interface RankingPageProps {
  ranking: (Player & {
    record: Record
  })[]
}

const DeviationRankingPage = async ({ ranking }: RankingPageProps) => {
  const count = await fetchPlayerCount()
  const getColor = (index: number) => getPlayerRankColor(index, count ?? null)

  return (
    <>
      <Headline title="偏差値ランキング" />
      <div className="mt-4 mb-4 space-y-2">
        {ranking.map((player, index) => (
          <PlayerCard player={player} chara={player.record.chara} key={index}>
            <div className="flex">
              <Shiny
                color={getColor(index)}
                className="rounded-lg border px-3"
                key={player.name}
              >
                <div className="text-xs text-gray-600">{index + 1}位</div>
              </Shiny>
              <div className="text-xs text-gray-600 ml-1">{`| ${player.deviation_value} (${player.average}P)`}</div>
            </div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}

export default DeviationRankingPage
