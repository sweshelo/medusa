import { cacheLife } from 'next/cache'
import { createAdminClient } from './admin'

const supabase = createAdminClient()

export const fetchPlayerAchievements = async (
  playerName: string,
): Promise<string[]> => {
  'use cache'
  cacheLife('hours')

  const { data, error } = await supabase.rpc('get_distinct_achievements', {
    player_name_param: playerName,
  })

  if (error) {
    console.error('プレイヤーの称号取得でエラー:', error)
    return []
  }

  return data?.map((row) => row.achievement) ?? []
}
