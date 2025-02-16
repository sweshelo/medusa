'use cache'

import { Metadata } from 'next'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

import { PlayerPage } from '@/features/player'
import { fetchAchievement } from '@/service/supabase/achievement'
import { fetchPlayer } from '@/service/supabase/player'

interface PageProps {
  params: Promise<{ name: string }>
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
  cacheLife('days')
  cacheTag(name)

  const player = await fetchPlayer(name)
  const achievement = (await fetchAchievement(player.records[0].achievement)) ?? undefined

  return player ? <PlayerPage player={player} achievement={achievement} /> : <></>
}
