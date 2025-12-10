'use cache'

import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

import { OnlinePlayers } from '@/features/online'
import { fetchOnlinePlayers } from '@/service/supabase/online'

export const metadata: Metadata = {
  title: 'オンラインのプレーヤー',
}

export default async function Page() {
  cacheLife({ stale: 30, revalidate: 60, expire: 120 }) // 1分

  const players = await fetchOnlinePlayers()
  const timestamp = new Date()
  return <OnlinePlayers players={players} timestamp={timestamp} />
}
