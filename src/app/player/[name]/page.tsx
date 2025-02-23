import { Metadata } from 'next'

import { PlayerPage } from '@/features/player'
import { fetchAchievement } from '@/service/supabase/achievement'
import { fetchPlayer, fetchRecentPlayedPlayersName } from '@/service/supabase/player'

interface PageProps {
  params: Promise<{ name: string }>
}

export const revalidate = 86400 // 丸一日キャッシュする
export const dynamicParams = true

export async function generateStaticParams() {
  const players = await fetchRecentPlayedPlayersName()
  return players.map(name => ({ name }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const name = decodeURI((await params).name)

  return {
    title: `${name}さんのページ`,
    description: `${name}さんの記録を閲覧します`,
  }
}

export default async function Page({ params }: PageProps) {
  const name = decodeURI((await params).name)
  if (!name) return

  const player = await fetchPlayer(name)
  const achievement = (await fetchAchievement(player.records[0]?.achievement)) ?? undefined

  return player ? <PlayerPage player={player} achievement={achievement} /> : <></>
}
