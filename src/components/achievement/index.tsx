import { Achievement } from '@/types/achievement'

import { Shiny } from '../common/shiny'

interface AchievementProps {
  achievement: Achievement | string
}

export const AchievementView = ({ achievement }: AchievementProps) => {
  console.log(achievement)
  if (typeof achievement === 'string') {
    return (
      <div className="bg-silver-gradient text-center">
        <span>{achievement}</span>
      </div>
    )
  }

  if (!achievement.markup) {
    return (
      <div className="bg-silver-gradient text-center">
        <span>{achievement.title}</span>
      </div>
    )
  }

  const color = (() => {
    if (achievement.icon_last) return 'shily-rainbow'
    if (achievement.icon_first) return 'shiny-gold'
    return 'shiny-silver'
  })()

  return (
    <Shiny color={color} className="p-1 rounded shadow text-center">
      <div dangerouslySetInnerHTML={{ __html: achievement.markup }} className="font-bold" />
    </Shiny>
  )
}
