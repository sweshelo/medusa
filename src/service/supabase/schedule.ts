import { supabase } from './client'

export const fetchSchedule = async () => {
  const { data, error } = await supabase.from('schedule').select('*')
  if (error) {
    console.error('スケジュール取得でエラー: ', error)
    return []
  } else {
    return data
  }
}
