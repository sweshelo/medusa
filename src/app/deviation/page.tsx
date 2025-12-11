import type { Metadata } from 'next'

import DeviationRankingPage from '@/features/deviation'
import { fetchDeviationRanking } from '@/service/supabase/deviation-ranking'

export const metadata: Metadata = {
  title: '偏差値ランキング',
}

export default async function Page() {
  const ranking = await fetchDeviationRanking()

  return ranking ? (
    <DeviationRankingPage ranking={ranking} />
  ) : (
    <>ランキング情報の取得に失敗しました</>
  )
}
