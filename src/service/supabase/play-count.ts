'use cache'

import { cacheLife } from 'next/cache'
import { createAdminClient } from './admin'

const supabase = createAdminClient()

export interface PlayCountRanking {
  player_name: string
  play_count: number
  chara: string
  achievement: string
}

export async function fetchPlayCountRanking(): Promise<PlayCountRanking[]> {
  cacheLife({ stale: 150, revalidate: 300, expire: 600 }) // 5分 - 必要に応じて調整してください

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
