import { cacheLife } from 'next/dist/server/use-cache/cache-life'

import { supabase } from './client'

export const fetchPlayer = async (playerName: string) => {
  // プレイヤー情報を取得
  const { data: players, error: playerError } = await supabase
    .from('player')
    .select('*')
    .eq('name', playerName)
    .limit(1)

  if (playerError) {
    throw new Error(`Error fetching player: ${playerError.message}`)
  }

  const [player] = players

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

  // 最高ランキング
  const { data: rankings } = await supabase
    .from('record')
    .select('ranking')
    .eq('player_name', playerName)
    .order('ranking', { ascending: true })
    .limit(1)
  const ranking = rankings?.[0].ranking ?? null

  // 最高貢献度
  const { data: max } = await supabase
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

export const fetchPlayerNames = async () => {
  'use cache'
  cacheLife('days')
  const { data, error } = await supabase.from('player').select('name').order('name')

  if (error) {
    console.error('ユーザ取得でエラー: ', error)
    return []
  } else {
    return data.map(player => player.name)
  }
}
