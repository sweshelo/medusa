import { supabase } from './client'

export const fetchPlayerAchievements = async (playerName: string): Promise<string[]> => {
  const { data, error } = await supabase.rpc('get_distinct_achievements', {
    player_name_param: playerName,
  })

  if (error) {
    console.error('プレイヤーの称号取得でエラー:', error)
    return []
  }

  return data?.map(row => row.achievement) ?? []
}
