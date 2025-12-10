'use cache'

import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

import { OnlinePlayers } from '@/features/online'
import { fetchOnlinePlayers } from '@/service/supabase/online'

export const metadata: Metadata = {
  title: 'オンラインのプレーヤー',
}

export default async function Page() {
  cacheLife({ stale: 120, revalidate: 240, expire: 600 })

  const players = await fetchOnlinePlayers()
  const timestamp = new Date()
  return <OnlinePlayers players={players} timestamp={timestamp} />
}
