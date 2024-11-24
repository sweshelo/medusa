import Link from 'next/link'

import { Player } from '@/types/player'
import { Ranking } from '@/types/ranking'
import { Record } from '@/types/record'

interface PlayerCardProps {
  player: Player | Ranking // FIXME: キモすぎるので辞めたい
  chara: Record['chara']
  ranking: Record['ranking']
}

export const PlayerCard = ({ player, chara, ranking }: PlayerCardProps) => {
  return (
    <Link className="bg-white rounded-lg flex items-center shadow" href={`/player/${player.name}`}>
      <img
        src={`https://p.eagate.573.jp/game/chase2jokers/ccj/images/ranking/icon/ranking_icon_${chara}.png`}
        alt={''}
        width={80}
        height={60}
        className="w-[80] h-[60] rounded-l-lg"
      />
      <div className="ml-3 flex-grow">
        <div className="text-sm text-gray-600">{ranking}位</div>
        <div className="text-3xl font-bold">{player.name}</div>
      </div>
    </Link>
  )
}
