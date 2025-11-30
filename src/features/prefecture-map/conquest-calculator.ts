/**
 * 制覇度を計算
 * @param playedPrefectures プレイ済み都道府県の配列
 * @param activePrefectures 稼働中の都道府県の配列
 * @returns 制覇済み数、稼働総数、制覇率
 */
export const calculateConquestRate = (
  playedPrefectures: string[],
  activePrefectures: string[],
): { played: number; total: number; rate: number } => {
  const total = activePrefectures.length

  // プレイ済み都道府県のうち、現在稼働中の都道府県の数をカウント
  const played = playedPrefectures.filter((prefecture) =>
    activePrefectures.includes(prefecture),
  ).length

  // 制覇率を計算（稼働都道府県が0の場合は0%）
  const rate = total > 0 ? (played / total) * 100 : 0

  return { played, total, rate }
}
