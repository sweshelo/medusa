import { PlayerDetail } from '@/types/player'

interface AchievementProps {
  achievement: PlayerDetail['achievement']
}

export const Achievement = ({ achievement }: AchievementProps) => {
  return (
    <div className="bg-silver-gradient text-center">
      <span>{achievement}</span>
    </div>
  )
}
