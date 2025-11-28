import { SmallHeadline } from '@/components/common/small-headline'
import { fetchActivePrefectures } from '@/service/scraping/prefecture-facilities'
import { fetchPlayerAchievements } from '@/service/supabase/record'

import { ConquestBar } from './conquest-bar'
import { calculateConquestRate } from './conquest-calculator'
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

  if (playedPrefectures.length === 0) {
    return null
  }

  // 稼働中の都道府県を取得（エラー時は制覇度バーを表示しない）
  let conquestData: { played: number; total: number; rate: number } | null = null
  try {
    const activePrefectures = await fetchActivePrefectures()
    if (activePrefectures.length > 0) {
      conquestData = calculateConquestRate(playedPrefectures, activePrefectures)
    }
  } catch (error) {
    console.error('制覇度の計算でエラー:', error)
  }

  return (
    <div>
      <SmallHeadline title="プレイエリアマップ" />
      {conquestData && (
        <ConquestBar
          played={conquestData.played}
          total={conquestData.total}
          rate={conquestData.rate}
        />
      )}
      <div className="bg-white rounded-lg shadow-sm mt-2">
        <PrefectureMap playedPrefectures={playedPrefectures} />
      </div>
    </div>
  )
}
