import { supabase } from './client'

export const fetchPlayer = async (playerName: string) => {
  // プレイヤー情報を取得
  const { data: player, error: playerError } = await supabase
    .from('player')
    .select('*')
    .eq('name', playerName)
    .single()

  console.log(playerError)
  if (playerError) {
    throw new Error(`Error fetching player: ${playerError.message}`)
  }

  // レコードを取得（新しい順に300件まで）
  const { data: records, error: recordsError } = await supabase
    .from('record')
    .select('*')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false })
    .limit(300)

  if (recordsError) {
    throw new Error(`Error fetching records: ${recordsError.message}`)
  }

  return {
    ...player,
    records,
  }
}
