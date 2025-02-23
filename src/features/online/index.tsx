import { TZDate } from '@date-fns/tz'
import { differenceInMinutes } from 'date-fns'

import { Headline } from '@/components/common/headline'
import { PlayerCard } from '@/components/player/card'
import { Revalidater } from '@/components/revalidater'

interface Props {
  players: {
    player_name: string
    chara: string
    recorded_at: string | null
  }[]
}

export const OnlinePlayers = ({ players }: Props) => {
  return (
    <>
      <Headline title="オンラインのプレイヤー" />
      <Revalidater />
      <div className="mt-4 mb-4 space-y-2">
        {players.map((player, index) => (
          <PlayerCard player={{ name: player.player_name }} chara={player.chara} key={index}>
            <div className="flex">
              <div className="text-sm text-gray-600 ml-1">
                {player.recorded_at
                  ? `${differenceInMinutes(new Date(), new TZDate(player.recorded_at, 'Asia/Tokyo'))}分前`
                  : '時刻不明'}
              </div>
            </div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}
