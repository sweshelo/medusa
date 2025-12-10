'use cache'

import { cacheLife } from 'next/cache'
import { createAdminClient } from './admin'

const supabase = createAdminClient()

export async function fetchAchievement(name: string) {
  cacheLife('hours') // 1時間

  const { data: achievement, error } = await supabase
    .from('achievement')
    .select('*')
    .eq('title', name)
    .limit(1)
    .single()
  if (error) {
    console.error('称号詳細取得でエラー: ', error)
  }

  return achievement
}

export async function fetchAllAchievements() {
  cacheLife('hours') // 1時間 - 必要に応じて調整してください

  const { data: achievements, error } = await supabase
    .from('achievement')
    .select('*')
  if (error) {
    console.error('称号一覧取得でエラー: ', error)
  }

  return achievements
}
