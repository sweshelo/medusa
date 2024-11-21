import { Achievement } from '@/types/achievement'

import { Shiny } from '../common/shiny'

interface AchievementProps {
  achievement: Achievement
}

export const AchievementView = ({ achievement }: AchievementProps) => {
  if (typeof achievement === 'string') {
    return (
      <div className="bg-silver-gradient text-center">
        <span>{achievement}</span>
      </div>
    )
  }

  if (!achievement.html) {
    return (
      <div className="bg-silver-gradient text-center">
        <span>{achievement.title}</span>
      </div>
    )
  }

  return (
    <Shiny color="shiny-gold" className="p-1 rounded shadow text-center">
      <div dangerouslySetInnerHTML={{ __html: achievement.html }} />
    </Shiny>
  )
}
