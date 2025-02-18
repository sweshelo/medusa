'use cache'

import { supabase } from './client'

export const fetchDeviationRanking = async () => {
  const { data: players, error: playerError } = await supabase(['ranking'])
    .from('player')
    .select('*')
    .gt('deviation_value', 50)
    .order('deviation_value', { ascending: false })

  if (playerError) {
    console.error(`Error fetching player: ${playerError.message}`)
  }

  // 各プレイヤーに対して最新の record を取得する
  const playersWithRecord = await Promise.all(
    (players ?? []).map(async player => {
      const { data: records, error: recordError } = await supabase(['ranking'])
        .from('record')
        .select('*')
        .eq('player_name', player.name)
        // 最新のレコードを取得するため created_at で降順にソートし、1件だけ取得
        .order('created_at', { ascending: false })
        .limit(1)

      if (recordError) {
        console.error(`Error fetching record for player ${player.name}: ${recordError.message}`)
      }

      const [record] = records ?? []

      return {
        ...player,
        record,
      }
    })
  )

  return playersWithRecord
}
