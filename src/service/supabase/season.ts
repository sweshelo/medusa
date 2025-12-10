'use cache'

import { cacheLife } from 'next/cache'
import type { Tables } from '@/types/database.types'

import { createAdminClient } from './admin'

const supabase = createAdminClient()

export type Season = Tables<'season'>

export async function fetchCurrentSeason(): Promise<Season | null> {
  cacheLife('hours') // 1時間 - 必要に応じて調整してください

  const { data, error } = await supabase
    .from('season')
    .select('*')
    .is('ended_at', null)
    .single()

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
