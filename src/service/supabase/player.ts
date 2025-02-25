import { subDays } from 'date-fns'

import { supabase } from './client'

export const fetchPlayer = async (playerName: string) => {
  // プレイヤー情報を取得
  const { data: players, error: playerError } = await supabase([playerName])
    .from('player')
    .select('*')
    .eq('name', playerName)
    .limit(1)

  if (playerError) {
    throw new Error(`Error fetching player: ${playerError.message}`)
  }

  const [player] = players

  // レコードを取得（新しい順に300件まで）
  const { data: records, error: recordsError } = await supabase([playerName])
    .from('record')
    .select('*')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false })
    .limit(300)

  if (recordsError) {
    throw new Error(`Error fetching records: ${recordsError.message}`)
  }

  // 最高ランキング
  const { data: rankings } = await supabase([playerName])
    .from('record')
    .select('ranking')
    .eq('player_name', playerName)
    .order('ranking', { ascending: true })
    .limit(1)
  const ranking = rankings?.[0].ranking ?? null

  // 最高貢献度
  const { data: max } = await supabase([playerName])
    .from('record')
    .select('diff')
    .eq('player_name', playerName)
    .order('diff', { ascending: false })
    .limit(1)
  const maxPoint = max?.[0].diff

  return {
    ...player,
    maxPoint,
    ranking,
    records,
  }
}

export const fetchAllPlayersName = async (): Promise<string[]> => {
  const { data: players, error: joinError } = await supabase(['ranking'])
    .from('player')
    .select(`name`)
    .order('name')

  if (joinError) {
    console.error('ユーザ取得でエラー: ', joinError)
    return []
  } else {
    return players.map(player => player.name)
  }
}

export const fetchRecentPlayedPlayersName = async (): Promise<string[]> => {
  const { data: players, error: joinError } = await supabase(['ranking'])
    .from('player')
    .select(`name`)
    .gte('updated_at', subDays(new Date(), 30).toISOString())
    .order('name')

  if (joinError) {
    console.error('ユーザ取得でエラー: ', joinError)
    return []
  } else {
    return players.map(player => player.name)
  }
}

export const fetchPlayerCount = async () => {
  // プレイヤー情報を取得
  const result = await supabase(['stats'])
    .from('player')
    .select('deviation_value', { count: 'exact', head: true })
    .not('deviation_value', 'is', null)

  if (result) {
    return result?.count
  }
}

export const fetchPlayerDeviationRanking = async (player: string) => {
  // ① 指定されたユーザーの deviation_value を取得する
  const { data: userData, error: userError } = await supabase([player])
    .from('player') // 対象のテーブル名（必要に応じて変更してください）
    .select('deviation_value')
    .eq('name', player)
    .single()

  if (userError || !userData) {
    console.error('ユーザー情報の取得でエラー:', userError)
    return null
  }

  const userDeviation = userData.deviation_value
  if (userDeviation === null) return null

  // ② ユーザーよりも高い deviation_value を持つプレイヤーの件数をカウントする
  const { count, error: countError } = await supabase([player])
    .from('player')
    .select('deviation_value', { count: 'exact', head: true })
    .neq('name', player)
    .gt('deviation_value', userDeviation)

  if (countError) {
    console.error('順位計算中のエラー:', countError)
    return null
  }

  return count
}
