import type { Metadata } from 'next'

import PlayCountRankingPage from '@/features/play'
import { fetchPlayCountRanking } from '@/service/supabase/play-count'
import { fetchCurrentSeason } from '@/service/supabase/season'

export const metadata: Metadata = {
  title: 'プレイ数ランキング',
}

export const revalidate = 86400

export default async function Page() {
  const ranking = await fetchPlayCountRanking()
  const season = await fetchCurrentSeason()
  const date = new Date()

  return (
    <PlayCountRankingPage ranking={ranking} season={season} timestamp={date} />
  )
}
