import { PrefectureAchievements } from '@/constants/prefecture'
import { PrefectureRanking } from '@/types/prefecture-ranking'
import { toHalfWidth } from '@/utils/text'

import { supabase } from './client'

interface PlayerAchievement {
  player_name: string
  achievement: string
}

/**
 * 制県度ランキングを取得
 * 1. RPCで全プレイヤーの(player_name, achievement)を取得（ページネーション対応）
 * 2. TypeScript側で都道府県の称号のみフィルタして集計
 */
export const fetchPrefectureConquestRanking = async (): Promise<PrefectureRanking[]> => {
  // 都道府県の称号リスト（半角）
  const prefectureAchievements = new Set(PrefectureAchievements.map(p => p.achievement))

  // RPC: 全プレイヤーの称号をDISTINCTで取得（ページネーション）
  const allPlayerAchievements: PlayerAchievement[] = []
  let hasMore = true
  let offset = 0
  const limit = 1000

  while (hasMore) {
    const { data, error } = await supabase
      .rpc('get_all_player_achievements')
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('プレイヤー称号取得でエラー:', error)
      break
    }

    if (!data || data.length === 0) {
      hasMore = false
      break
    }

    allPlayerAchievements.push(...data)

    if (data.length < limit) {
      hasMore = false
    } else {
      offset += limit
    }
  }

  const playerAchievements = allPlayerAchievements

  // プレイヤーごとに都道府県数をカウント
  const playerPrefectureCount = new Map<string, number>()

  for (const record of playerAchievements) {
    // 全角→半角変換
    const normalizedAchievement = toHalfWidth(record.achievement)

    // 都道府県の称号かチェック
    if (prefectureAchievements.has(normalizedAchievement)) {
      const currentCount = playerPrefectureCount.get(record.player_name) || 0
      playerPrefectureCount.set(record.player_name, currentCount + 1)
    }
  }

  // ランキング形式に変換（5都道府県以上のみ）
  const preliminaryRanking = Array.from(playerPrefectureCount.entries())
    .filter(([, prefecture_count]) => prefecture_count >= 5) // 5都道府県以上のみ
    .map(([player_name, prefecture_count]) => ({
      player_name,
      prefecture_count,
    }))
    .sort((a, b) => {
      // 都道府県数で降順ソート、同数ならプレイヤー名で昇順
      if (b.prefecture_count !== a.prefecture_count) {
        return b.prefecture_count - a.prefecture_count
      }
      return a.player_name.localeCompare(b.player_name)
    })
    .slice(0, 100) // TOP 100

  // ランキング確定後、TOP100のプレイヤーのみキャラ情報を取得
  const playerCharaMap = new Map<string, string>()
  for (const player of preliminaryRanking) {
    const { data } = await supabase
      .from('record')
      .select('chara')
      .eq('player_name', player.player_name)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()

    if (data?.chara) {
      playerCharaMap.set(player.player_name, data.chara)
    }
  }

  // キャラ情報を追加
  const ranking: PrefectureRanking[] = preliminaryRanking.map(player => ({
    ...player,
    chara: playerCharaMap.get(player.player_name) || null,
  }))

  return ranking
}
