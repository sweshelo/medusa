import Link from 'next/link'

interface PlayerCardProps {
  player: {
    chara: number
    name: string
    rank: number
    points: number
  }
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
          {player.rank}位 - {player.points}P
        </div>
        <div className="text-lg font-bold">{player.name}</div>
      </div>
    </Link>
  )
}
