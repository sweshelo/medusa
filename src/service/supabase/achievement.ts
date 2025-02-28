import { supabase } from './client'

export const fetchAchievement = async (name: string) => {
  const { data: achievement, error } = await supabase
    .from('achievement')
    .select('*')
    .eq('title', name)
    .single()
  if (error) {
    console.error('称号詳細取得でエラー: ', error)
  }

  return achievement
}
