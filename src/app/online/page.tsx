import { Metadata } from 'next'

import { OnlinePlayers } from '@/features/online'
import { fetchOnlinePlayers } from '@/service/supabase/online'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'オンラインのプレーヤー',
}

export default async function Page() {
  const players = await fetchOnlinePlayers()
  return <OnlinePlayers players={players} />
}
