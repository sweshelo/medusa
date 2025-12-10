'use cache'

import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

import { PrefectureRankingPage } from '@/features/prefecture-ranking'
import { fetchPrefectureConquestRanking } from '@/service/supabase/prefecture-ranking'

export const metadata: Metadata = {
  title: '制県度ランキング',
  description: 'プレイヤーの都道府県制覇状況をランキング形式で表示します',
}

export default async function Page() {
  cacheLife({ stale: 300, revalidate: 600, expire: 1200 }) // 10分

  const ranking = await fetchPrefectureConquestRanking()
  const timestamp = new Date()
  return <PrefectureRankingPage ranking={ranking} timestamp={timestamp} />
}
