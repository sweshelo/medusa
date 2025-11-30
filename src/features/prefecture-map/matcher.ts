import { PrefectureAchievements } from '@/constants/prefecture'
import { toHalfWidth } from '@/utils/text'

/**
 * DBから取得した称号（全角）をconstants/prefecture.tsと照合し、
 * プレイ済み都道府県名の配列を返す
 */
export const getPlayedPrefectures = (achievements: string[]): string[] => {
  const playedPrefectures: string[] = []

  // DBの称号を半角に変換
  const halfWidthAchievements = achievements.map((achievement) =>
    toHalfWidth(achievement),
  )

  // PrefectureAchievementsと照合
  for (const prefecture of PrefectureAchievements) {
    if (halfWidthAchievements.includes(prefecture.achievement)) {
      playedPrefectures.push(prefecture.name)
    }
  }

  return playedPrefectures
}
