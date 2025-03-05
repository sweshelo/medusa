import { endOfMonth, subMonths } from 'date-fns'
import { Metadata } from 'next'

import RankingPage from '@/features/ranking'
import { fetchRankingTable } from '@/service/original/ranking'

export const metadata: Metadata = {
  title: 'ランキング',
}

export const revalidate = 43200

export default async function Page() {
  const ranking =
    (await fetchRankingTable()) ??
    (await fetchRankingTable(endOfMonth(subMonths(new Date(), 1)))) ??
    []

  return <RankingPage ranking={ranking.sort((a, b) => a.rank - b.rank)} />
}
