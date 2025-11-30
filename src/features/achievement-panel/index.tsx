import { format } from 'date-fns'
import Link from 'next/link'

import { AchievementView } from '@/components/achievement'
import type { AchievementInfo } from '@/service/scraping/achievement'
import type { Database } from '@/types/database.types'
import { toHalfWidth } from '@/utils/text'

interface AchievementPanelProps {
  achievement: Database['public']['Tables']['achievement']['Row']
  infomations: AchievementInfo[]
}

export const AchievementPanel = ({
  achievement,
  infomations,
}: AchievementPanelProps) => {
  const { description } =
    infomations.find((info) => info.title === toHalfWidth(achievement.title)) ??
    {}

  return (
    <details className="my-2 bg-white rounded-sm">
      <summary className="list-none cursor-pointer">
        <AchievementView achievement={achievement} />
      </summary>
      {description && (
        <p className="text-center text-xs text-gray-600 my-1 py-1 bg-gray-200 italic px-1">
          {description}
        </p>
      )}
      <p className="p-1 text-center">
        {achievement.discoverer && (
          <>
            <span className="text-blue-600 hover:text-blue-800 hover:underline font-medium mr-1">
              <Link href={`/player/${achievement.discoverer}`}>
                {achievement.discoverer}
              </Link>
            </span>
            によって
          </>
        )}
        {`${format(achievement.created_at, 'yyyy/MM/dd')}に発見`}
      </p>
    </details>
  )
}
