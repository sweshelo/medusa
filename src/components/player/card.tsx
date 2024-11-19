import Link from 'next/link'

import { Player } from '@/types/player'

interface PlayerCardProps {
  player: Player
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <Link className="bg-white rounded-lg flex items-center shadow" href={`/player/${player.name}`}>
      <img
        src={`https://p.eagate.573.jp/game/chase2jokers/ccj/images/ranking/icon/ranking_icon_${player.chara}.png`}
        alt={''}
        width={80}
        height={60}
        className="w-[80] h-[60] rounded-l-lg"
      />
      <div className="ml-3 flex-grow">
        <div className="text-sm text-gray-600">
          {player.ranking}位 - {player.points}P
        </div>
        <div className="text-3xl font-bold">{player.name}</div>
      </div>
    </Link>
  )
}
