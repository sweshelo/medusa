import { SmallHeadline } from '@/components/common/small-headline'
import { fetchPlayerAchievements } from '@/service/supabase/record'

import { PrefectureMap } from './map'
import { getPlayedPrefectures } from './matcher'

interface PlayedPrefectureMapProps {
  playerName: string
}

export const PlayedPrefectureMap = async ({ playerName }: PlayedPrefectureMapProps) => {
  // プレイヤーの称号を取得
  const achievements = await fetchPlayerAchievements(playerName)

  // プレイ済み都道府県を判定
  const playedPrefectures = getPlayedPrefectures(achievements)

  return playedPrefectures.length > 0 ? (
    <div>
      <SmallHeadline title="プレイエリアマップ" />
      <div className="bg-white rounded-lg shadow-sm mt-2">
        <PrefectureMap playedPrefectures={playedPrefectures} />
      </div>
    </div>
  ) : null
}
