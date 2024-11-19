import { Metadata } from 'next'

import RankingPage from '@/features/ranking'
import { MockRankingResponse } from '@/mock/ranking'

export const metadata: Metadata = {
  title: 'ランキング',
}

export default async function Page() {
  const { ranking } = await MockRankingResponse
  return <RankingPage ranking={ranking} />
}
