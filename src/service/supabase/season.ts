import type { Tables } from '@/types/database.types'

import { supabase } from './client'

export type Season = Tables<'season'>

export const fetchCurrentSeason = async (): Promise<Season | null> => {
  const { data, error } = await supabase.from('season').select('*').is('ended_at', null).single()

  if (error) {
    console.error('現在のシーズン取得でエラー: ', error)
    return null
  }

  return data
}

export const fetchAllSeasons = async (): Promise<Season[]> => {
  const { data, error } = await supabase
    .from('season')
    .select('*')
    .order('number', { ascending: false })

  if (error) {
    console.error('シーズン一覧取得でエラー: ', error)
    return []
  }

  return data || []
}
