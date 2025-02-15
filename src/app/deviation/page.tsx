import DeviationRankingPage from '@/features/deviation'
import { fetchDeviationRanking } from '@/service/supabase/deviation-ranking'

export default async function Page() {
  const ranking = await fetchDeviationRanking()

  return ranking ? (
    <DeviationRankingPage ranking={ranking} />
  ) : (
    <>ランキング情報の取得に失敗しました</>
  )
}
