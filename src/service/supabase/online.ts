import { tz } from '@date-fns/tz'
import { sub } from 'date-fns'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'

import { supabase } from './client'

export const fetchOnlinePlayers = async () => {
  'use cache'
  cacheLife('minutes')
  const { data, error } = await supabase(['online'])
    .from('record')
    .select('player_name, chara, recorded_at')
    .order('recorded_at', { ascending: false })
    .gte('recorded_at', sub(new Date(), { minutes: 30 }, { in: tz('Asia/Tokyo') }).toISOString())

  if (error) {
    console.error('オンライン取得でエラー: ', error)
    return []
  } else {
    const seen = new Set()
    const uniqueRecords = data.filter(record => {
      if (seen.has(record.player_name)) {
        return false
      } else {
        seen.add(record.player_name)
        return true
      }
    })
    return uniqueRecords
  }
}
