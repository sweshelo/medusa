import type { Metadata } from 'next'

import { PrefectureRankingPage } from '@/features/prefecture-ranking'
import { fetchPrefectureConquestRanking } from '@/service/supabase/prefecture-ranking'

export const metadata: Metadata = {
  title: '制県度ランキング',
  description: 'プレイヤーの都道府県制覇状況をランキング形式で表示します',
}

export const revalidate = 604800 // 1週間キャッシュ

export default async function Page() {
  const ranking = await fetchPrefectureConquestRanking()

  return <PrefectureRankingPage ranking={ranking} />
}
