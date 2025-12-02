import { differenceInMinutes, format } from 'date-fns'

import { Headline } from '@/components/common/headline'
import { PlayerCard } from '@/components/player/card'
import { Revalidater } from '@/components/revalidater'

import { ScheduleTable } from '../schedule'

interface Props {
  players: {
    player_name: string
    chara: string
    recorded_at: string | null
  }[]
  timestamp: Date
}

export const OnlinePlayers = ({ players, timestamp }: Props) => {
  return (
    <>
      <Headline title="オンラインのプレイヤー" />
      <Revalidater timestamp={timestamp} />
      <ScheduleTable />
      <div className="mt-4 mb-4 space-y-2">
        {players.map((player) => (
          <PlayerCard
            player={{ name: player.player_name }}
            chara={player.chara}
            key={`${player.player_name}`}
          >
            <div className="flex">
              <div className="text-sm text-gray-600 ml-1">
                {player.recorded_at
                  ? `最終プレイ: ${differenceInMinutes(new Date(), new Date(`${player.recorded_at}+09:00`))}分前 (${format(new Date(player.recorded_at), 'HH:mm')})`
                  : '時刻不明'}
              </div>
            </div>
          </PlayerCard>
        ))}
      </div>
    </>
  )
}
