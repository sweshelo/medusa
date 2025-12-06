import Link from 'next/link'
import { SmallHeadline } from '@/components/common/small-headline'
import { createClient } from '@/service/supabase/server'
import type { Tables } from '@/types/database.types'
import { GameRecordsTable } from './index'

type GameImage = Tables<'game_image'>
type Game = Tables<'game'>
type GameResult = Tables<'game_result'>

interface GameWithResults extends Game {
  game_result: GameResult[]
}

type ImageWithGame = GameImage & {
  game: GameWithResults[]
}

interface PlayerGameRecordsServerProps {
  playerId: number
  playerName: string
}

export async function PlayerGameRecordsServer({
  playerId,
  playerName,
}: PlayerGameRecordsServerProps) {
  const supabase = await createClient()

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未認証の場合は何も表示しない
  if (!user) {
    return null
  }

  // ユーザーのprofileを取得して、player_idが一致するか確認
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('player_id')
    .eq('id', user.id)
    .single()

  // プロファイルがない、または自分のページでない場合は何も表示しない
  if (profileError || !profile || profile.player_id !== playerId) {
    return null
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
    return (
      <div className="my-4">
        <SmallHeadline title="画像記録履歴" />
        <div className="bg-white rounded-lg p-4 text-center text-red-500">
          データの取得に失敗しました
        </div>
      </div>
    )
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

  // データがある場合のみ表示
  if (gameResults.length === 0) {
    return (
      <div className="my-4">
        <SmallHeadline title="画像記録履歴" />
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          画像記録がありません
        </div>
      </div>
    )
  }

  return (
    <div className="my-4">
      <SmallHeadline title="画像記録履歴" />
      <div className="bg-white p-3 mb-2 text-sm text-gray-600 rounded-lg text-center">
        <Link href="/pekora" className="underline text-blue-400 px-1">
          画像記録機能
        </Link>
        で登録したリザルトが表示されます
        <br />
      </div>
      <GameRecordsTable records={gameResults.reverse()} />
    </div>
  )
}
