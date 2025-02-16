import Image from 'next/image'
import Link from 'next/link'

import { Player } from '@/types/player'
import { Ranking } from '@/types/ranking'
import { Record } from '@/types/record'

interface PlayerCardProps {
  player: Player | Ranking // FIXME: キモすぎるので辞めたい
  chara: Record['chara']
  children?: React.ReactElement | React.ReactElement[]
}

export const PlayerCard = ({ player, chara, children }: PlayerCardProps) => {
  return (
    <Link
      className="bg-white rounded-lg flex items-center shadow truncate"
      href={`/player/${player.name}`}
    >
      <Image
        src={`https://p.eagate.573.jp/game/chase2jokers/ccj/images/ranking/icon/ranking_icon_${chara}.png`}
        alt={''}
        width={80}
        height={60}
        className="w-[80px] h-[60px] rounded-l-lg"
      />
      <div className="ml-3 flex-grow min-w-0 pr-1">
        {children}
        <div className="text-3xl font-bold text-left">{player.name}</div>
      </div>
    </Link>
  )
}
