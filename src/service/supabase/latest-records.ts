import { supabase } from './client'

export const fetchLatestRecords = async (players: string[]) => {
  // 各プレイヤーに対して最新の record を取得する
  const records = await Promise.all(
    (players ?? []).map(async (player) => {
      const { data: records, error: recordError } = await supabase
        .from('record')
        .select('*')
        .eq('player_name', player)
        // 最新のレコードを取得するため created_at で降順にソートし、1件だけ取得
        .order('created_at', { ascending: false })
        .limit(1)

      if (recordError) {
        console.error(
          `Error fetching record for player ${player}: ${recordError.message}`,
        )
      }

      const [record] = records ?? []

      return {
        player,
        record,
      }
    }),
  )

  return records
}
