'use server'

import { createClient } from '@/service/supabase/server'
import type { Tables } from '@/types/database.types'

type GameImage = Tables<'game_image'>
type Game = Tables<'game'>
type GameResult = Tables<'game_result'>

interface GameWithResults extends Game {
  game_result: GameResult[]
}

type ImageWithGame = GameImage & {
  game: GameWithResults[]
}

export async function getPlayerGameResults(
  playerId: number,
  playerName: string,
) {
  const supabase = await createClient()

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', data: null }
  }

  // ユーザーのprofileを取得して、player_idが一致するか確認
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('player_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: 'Profile not found', data: null }
  }

  // 自分のページかチェック
  if (profile.player_id !== playerId) {
    return { error: 'Unauthorized to view this data', data: null }
  }

  // game_image > game > game_result を取得
  const { data: images, error } = await supabase
    .from('game_image')
    .select(`
      *,
      game!game_image_id_fkey(
        *,
        game_result(*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch game results:', error)
    return { error: error.message, data: null }
  }

  // プレイヤー名でフィルタリングして、フラット化
  const gameResults: Array<
    GameResult & {
      played_at: string | null
      image_created_at: string
    }
  > = []

  for (const image of images as ImageWithGame[]) {
    if (image.game && Array.isArray(image.game)) {
      for (const game of image.game) {
        if (game.game_result && Array.isArray(game.game_result)) {
          for (const result of game.game_result) {
            if (result.player_name === playerName) {
              gameResults.push({
                ...result,
                played_at: game.played_at,
                image_created_at: image.created_at,
              })
            }
          }
        }
      }
    }
  }

  return { error: null, data: gameResults }
}
