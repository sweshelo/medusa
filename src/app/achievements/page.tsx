import type { Metadata } from 'next'

import { Headline } from '@/components/common/headline'
import { AchievementList } from '@/features/achievement-list'
import { fetchAchievementInfomation } from '@/service/scraping/achievement'
import { fetchAllAchievements } from '@/service/supabase/achievement'
import type { Database } from '@/types/database.types'

export const metadata: Metadata = {
  title: '称号',
}

export const revalidate = 43200

export default async function Page() {
  const achievements = await fetchAllAchievements()
  const infomations = await fetchAchievementInfomation()

  const getAchievementPriority = (
    achievement: Database['public']['Tables']['achievement']['Row']
  ): number => {
    if (achievement.icon_last) return 4
    if (achievement.icon_first) return 3
    if (achievement.markup && achievement.markup !== achievement.title) return 2
    return 1
  }

  const sortedAchievements =
    achievements?.sort((a, b) => {
      const priorityDiff = getAchievementPriority(b) - getAchievementPriority(a)

      // 優先度が異なる場合は優先度でソート
      if (priorityDiff !== 0) {
        return priorityDiff
      }

      // 優先度が同じ場合はcreated_atでソート（新しい順）
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }) || []

  return (
    <>
      <Headline title="称号一覧" />
      <AchievementList achievements={sortedAchievements} infomations={infomations} />
    </>
  )
}
