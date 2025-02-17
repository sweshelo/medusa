import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

import { supabase } from './client'

export const fetchPlayer = async (playerName: string) => {
  'use cache'
  cacheTag(playerName)
  cacheLife('days')

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

export const fetchPlayerWithRecord = async (): Promise<string[]> => {
  'use cache'
  cacheLife('days')
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
