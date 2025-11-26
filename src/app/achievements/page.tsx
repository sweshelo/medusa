import { format } from 'date-fns'
import { Metadata } from 'next'
import Link from 'next/link'

import { AchievementView } from '@/components/achievement'
import { Headline } from '@/components/common/headline'
import { fetchAllAchievements } from '@/service/supabase/achievement'
import { Database } from '@/types/database.types'

export const metadata: Metadata = {
  title: '称号',
}

export const revalidate = 43200

export default async function Page() {
  const achievements = await fetchAllAchievements()

  const getAchievementPriority = (
    achievement: Database['public']['Tables']['achievement']['Row']
  ): number => {
    if (achievement.icon_last) return 4
    if (achievement.icon_first) return 3
    if (achievement.markup && achievement.markup !== achievement.title) return 2
    return 1
  }

  return (
    <>
      <Headline title="称号一覧" />
      <div className="bg-white text-center py-2 mb-2 rounded-lg">
        <span className="text-sm text-gray-600">
          閻魔帳に記録された称号一覧です
          <br />
          クリックすると詳細を開閉します
        </span>
      </div>
      {achievements
        ?.sort((a, b) => {
          const priorityDiff = getAchievementPriority(b) - getAchievementPriority(a)

          // 優先度が異なる場合は優先度でソート
          if (priorityDiff !== 0) {
            return priorityDiff
          }

          // 優先度が同じ場合はcreated_atでソート（新しい順）
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        .map(achievement => (
          <details className="my-2 bg-white rounded" key={achievement.id} open>
            <summary className="list-none">
              <AchievementView achievement={achievement} />
            </summary>
            <p className="p-1 text-center">
              {achievement.discoverer && (
                <>
                  <span className="text-blue-600 hover:text-blue-800 hover:underline font-medium mr-1">
                    <Link href={`/player/${achievement.discoverer}`}>{achievement.discoverer}</Link>
                  </span>
                  によって
                </>
              )}
              {`${format(achievement.created_at, 'yyyy/MM/dd')}に発見`}
            </p>
          </details>
        ))}
    </>
  )
}
