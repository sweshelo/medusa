import type { Metadata } from 'next'

import { PlayerPage } from '@/features/player'
import { fetchAchievement } from '@/service/supabase/achievement'
import {
  fetchPlayer,
  fetchRecentPlayedPlayersId,
} from '@/service/supabase/player'

interface PageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 86400 // 丸一日キャッシュする
export const dynamicParams = true

export async function generateStaticParams() {
  const players = await fetchRecentPlayedPlayersId()
  return players.map((id) => ({ id: `${id}` }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name } = await fetchPlayer(parseInt((await params).id, 10))
  return {
    title: `${name}さんのページ`,
    description: `${name}さんの記録を閲覧します`,
    robots: {
      index: false,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const player = await fetchPlayer(parseInt((await params).id, 10))
  const achievement =
    (await fetchAchievement(player.records[0].achievement)) ?? undefined
  const date = new Date()

  return player ? (
    <PlayerPage player={player} achievement={achievement} timestamp={date} />
  ) : null
}
