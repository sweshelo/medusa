import { supabase } from './client'

export const fetchAchievement = async (name: string) => {
  console.log(name)
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

export const fetchAllAchievements = async () => {
  const { data: achievements, error } = await supabase
    .from('achievement')
    .select('*')
  if (error) {
    console.error('称号一覧取得でエラー: ', error)
  }

  return achievements
}
