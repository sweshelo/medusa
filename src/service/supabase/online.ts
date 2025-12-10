'use cache'

import { TZDate } from '@date-fns/tz'
import { sub } from 'date-fns'
import { cacheLife } from 'next/cache'

import { createAdminClient } from './admin'

const supabase = createAdminClient()

export async function fetchOnlinePlayers() {
  cacheLife({ stale: 30, revalidate: 60, expire: 120 }) // 1分 - 必要に応じて調整してください

  const { data, error } = await supabase
    .from('record')
    .select('player_name, chara, recorded_at')
    .order('recorded_at', { ascending: false })
    .gte(
      'recorded_at',
      sub(new TZDate(new Date(), 'Asia/Tokyo'), { minutes: 30 }).toISOString(),
    )

  if (error) {
    console.error('オンライン取得でエラー: ', error)
    return []
  } else {
    const seen = new Set()
    const uniqueRecords = data.filter((record) => {
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
