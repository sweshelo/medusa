import { createAdminClient } from './admin'

const supabase = createAdminClient()

export interface PlayCountRanking {
  player_name: string
  play_count: number
  chara: string
  achievement: string
}

export const fetchPlayCountRanking = async (): Promise<PlayCountRanking[]> => {
  // PostgreSQL関数を使用して効率的にプレイ数をカウント
  // 現在のシーズン中のレコードのみを集計
  // 「プレーヤー」(匿名プレイヤー)を除外
  const { data, error } = await supabase.rpc('get_play_count_ranking')

  if (error) {
    console.error('Error fetching play count ranking:', error)
    return []
  }

  return data || []
}
