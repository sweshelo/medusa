'use cache'

import { endOfMonth, subMonths } from 'date-fns'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

import RankingPage from '@/features/ranking'
import { fetchRankingTable } from '@/service/original/ranking'

export const metadata: Metadata = {
  title: 'ランキング',
}

export default async function Page() {
  cacheLife('hours')

  const now = new Date()
  const ranking =
    (await fetchRankingTable()) ??
    (await fetchRankingTable(endOfMonth(subMonths(now, 1)))) ??
    []
  return <RankingPage ranking={ranking.sort((a, b) => a.rank - b.rank)} />
}
