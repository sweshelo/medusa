'use server'

import { createClient } from '@/service/supabase/server'

export async function linkPlayerToUser(playerName: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'ユーザー認証に失敗しました' }
  }

  // Check if user already has a linked player via profile
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('player_id, player:player_id(id, name)')
    .eq('id', user.id)
    .single()

  if (existingProfile?.player_id) {
    const playerName =
      existingProfile.player &&
      typeof existingProfile.player === 'object' &&
      'name' in existingProfile.player
        ? existingProfile.player.name
        : 'unknown'
    return {
      error: `既に「${playerName}」と紐づいています`,
      currentPlayer: playerName,
    }
  }

  // Check if the player exists
  const { data: targetPlayer, error: playerError } = await supabase
    .from('player')
    .select('id, name')
    .eq('name', playerName)
    .single()

  if (playerError) {
    return { error: 'プレイヤーが見つかりませんでした' }
  }

  // Check if the player is not already linked to another user
  const { data: existingLink } = await supabase
    .from('profiles')
    .select('id')
    .eq('player_id', targetPlayer.id)
    .single()

  if (existingLink) {
    return { error: 'このプレイヤーは既に他のユーザーと紐づいています' }
  }

  // Link the player to the user's profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ player_id: targetPlayer.id })
    .eq('id', user.id)

  if (updateError) {
    return { error: 'プレイヤーの紐づけに失敗しました' }
  }

  return { success: true, playerName: targetPlayer.name }
}

export async function unlinkPlayer() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'ユーザー認証に失敗しました' }
  }

  // Unlink the player from profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ player_id: null })
    .eq('id', user.id)

  if (updateError) {
    return { error: 'プレイヤーの紐づけ解除に失敗しました' }
  }

  return { success: true }
}

export async function getLinkedPlayer() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { player: null }
  }

  // Get linked player via profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('player:player_id(id, name)')
    .eq('id', user.id)
    .single()

  const player =
    profile?.player &&
    typeof profile.player === 'object' &&
    'id' in profile.player &&
    'name' in profile.player
      ? { id: profile.player.id, name: profile.player.name }
      : null

  return { player }
}

export async function getAllPlayersName(): Promise<string[]> {
  const supabase = await createClient()

  const { data: players, error } = await supabase
    .from('player')
    .select('name')
    .order('name')

  if (error) {
    console.error('ユーザ取得でエラー: ', error)
    return []
  }

  return players.map((player) => player.name)
}
