import { subDays } from 'date-fns'

import { supabase } from './client'

export const getPlayerIdByName = async (playerName: string) => {
  const { data: players, error } = await supabase
    .from('player')
    .select('id')
    .eq('name', playerName)
    .limit(1)

  if (error) {
    throw new Error(`Error fetching player: ${error.message}`)
  }

  const [player] = players
  return player.id
}

export const fetchPlayer = async (playerId: number) => {
  // プレイヤー情報を取得
  const { data: players, error: playerError } = await supabase
    .from('player')
    .select('*')
    .eq('id', playerId)
    .limit(1)

  if (playerError) {
    throw new Error(`Error fetching player: ${playerError.message}`)
  }

  const [player] = players

  // レコードを取得（新しい順に300件まで）
  const { data: records, error: recordsError } = await supabase
    .from('record')
    .select('*')
    .eq('player_name', player.name)
    .or('version.eq.2023-04-05,version.is.null')
    .order('created_at', { ascending: false })
    .limit(300)

  if (recordsError) {
    throw new Error(`Error fetching records: ${recordsError.message}`)
  }

  // ランクゲージレコード
  const { data: rankRecords, error: rankRecordsError } = await supabase
    .from('record')
    .select('id, chara, point, diff, recorded_at, elapsed, version')
    .eq('player_name', player.name)
    .in('version', ['2024-01-01', '2025-12-01'])
    .order('created_at', { ascending: false })
    .limit(100)

  if (rankRecordsError) {
    throw new Error(`Error fetching records: ${rankRecordsError.message}`)
  }

  // 最高ランキング
  const { data: rankings } = await supabase
    .from('record')
    .select('ranking')
    .eq('player_name', player.name)
    .order('ranking', { ascending: true })
    .limit(1)
  const ranking = rankings?.[0]?.ranking ?? null

  return {
    ...player,
    ranking,
    records,
    rankRecords,
  }
}

export const fetchAllPlayersName = async (): Promise<string[]> => {
  const { data: players, error: joinError } = await supabase
    .from('player')
    .select(`name`)
    .order('name')

  if (joinError) {
    console.error('ユーザ取得でエラー: ', joinError)
    return []
  } else {
    return players.map((player) => player.name)
  }
}

export const fetchRecentPlayedPlayersId = async (): Promise<number[]> => {
  const { data: players, error: joinError } = await supabase
    .from('player')
    .select(`id`)
    .gte('updated_at', subDays(new Date(), 30).toISOString())
    .order('updated_at', { ascending: false })
    .limit(50)

  if (joinError) {
    console.error('ユーザ取得でエラー: ', joinError)
    return []
  } else {
    return players.map((player) => player.id)
  }
}

export const fetchPlayerCount = async () => {
  // プレイヤー情報を取得
  const result = await supabase
    .from('player')
    .select('deviation_value', { count: 'exact', head: true })
    .not('deviation_value', 'is', null)

  if (result) {
    return result?.count
  }
}

export const fetchPlayerDeviationRanking = async (player: string) => {
  // ① 指定されたユーザーの deviation_value を取得する
  const { data: userData, error: userError } = await supabase
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
  const { count, error: countError } = await supabase
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
