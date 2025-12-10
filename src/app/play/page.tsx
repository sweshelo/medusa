'use cache'

import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

import PlayCountRankingPage from '@/features/play'
import { fetchPlayCountRanking } from '@/service/supabase/play-count'
import { fetchCurrentSeason } from '@/service/supabase/season'

export const metadata: Metadata = {
  title: 'プレイ数ランキング',
}

export default async function Page() {
  cacheLife({ stale: 150, revalidate: 300, expire: 600 }) // 5分

  const ranking = await fetchPlayCountRanking()
  const season = await fetchCurrentSeason()
  const timestamp = new Date()
  return (
    <PlayCountRankingPage
      ranking={ranking}
      season={season}
      timestamp={timestamp}
    />
  )
}
