import Image from 'next/image'
import Link from 'next/link'

import { Record } from '@/types/record'

interface PlayerCardProps {
  player: {
    name: string
  }
  chara?: Record['chara']
  children?: React.ReactElement | React.ReactElement[]
}

export const PlayerCard = ({ player, chara, children }: PlayerCardProps) => {
  return (
    <Link
      className="bg-white rounded-lg flex items-center shadow-sm truncate"
      href={`/player/${player.name}`}
    >
      <Image
        src={
          chara
            ? `https://p.eagate.573.jp/game/chase2jokers/ccj/images/ranking/icon/ranking_icon_${chara}.png`
            : 'https://eacache.s.konaminet.jp/game/chase2jokers/ccj/images/character/chara_image/icon/chara_icon_unbanned.png'
        }
        alt={''}
        width={80}
        height={60}
        className="w-[80px] h-[60px] rounded-l-lg"
        unoptimized
      />
      <div className="ml-3 grow min-w-0 pr-1">
        {children}
        <div className="text-3xl font-bold text-left">{player.name}</div>
      </div>
    </Link>
  )
}
