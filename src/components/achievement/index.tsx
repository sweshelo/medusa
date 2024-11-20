import { PlayerDetail } from '@/types/player'

import { Shiny } from '../common/shiny'

interface AchievementProps {
  achievement: PlayerDetail['achievement']
}

export const Achievement = ({ achievement }: AchievementProps) => {
  return (
    <>
      {typeof achievement === 'string' ? (
        <div className="bg-silver-gradient text-center">
          <span>{achievement}</span>
        </div>
      ) : (
        <Shiny color="shiny-gold" className="p-1 rounded shadow text-center">
          <div dangerouslySetInnerHTML={{ __html: achievement.html }} />
        </Shiny>
      )}
    </>
  )
}
