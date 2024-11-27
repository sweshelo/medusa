import { Metadata } from 'next'

import RankingPage from '../../features/ranking'
import { fetchRankingTable } from '../../service/original/ranking'

export const metadata: Metadata = {
  title: 'ランキング',
}

export default async function Page() {
  const ranking = await fetchRankingTable()
  return <RankingPage ranking={ranking.sort((a, b) => a.rank - b.rank)} />
}
