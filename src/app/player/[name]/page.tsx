'use cache'

import { Metadata } from 'next'

import { PlayerPage } from '@/features/player'
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
  const player = await fetchPlayer(name)

  return player ? <PlayerPage player={player} /> : <></>
}
