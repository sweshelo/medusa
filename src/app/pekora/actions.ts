'use server'

import { createAdminClient } from '@/service/supabase/admin'
import { createClient } from '@/service/supabase/server'
import type { TablesUpdate } from '@/types/database.types'

export async function getUploadedImages() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', images: null }
  }

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
    console.error('Failed to fetch images:', error)
    return { error: error.message, images: null }
  }

  return { error: null, images }
}

export async function updateGameResult(
  resultId: number,
  updates: TablesUpdate<'game_result'>,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  // Check if user owns the game_result through game_image
  const { data: existingResult, error: checkError } = await supabase
    .from('game_result')
    .select(`
      id,
      game:game_id(
        id,
        game_image:image_id(
          user_id
        )
      )
    `)
    .eq('id', resultId)
    .single()

  if (checkError || !existingResult) {
    console.error('Failed to check ownership:', checkError)
    return { error: 'Result not found', success: false }
  }

  // Verify ownership
  const gameImageUserId = (existingResult.game as any)?.game_image?.user_id
  if (gameImageUserId !== user.id) {
    return { error: 'Unauthorized to edit this result', success: false }
  }

  // Use admin client to bypass RLS and update the game_result
  const adminSupabase = createAdminClient()
  const { error: updateError } = await adminSupabase
    .from('game_result')
    .update(updates)
    .eq('id', resultId)

  if (updateError) {
    console.error('Failed to update game result:', updateError)
    return { error: updateError.message, success: false }
  }

  return { error: null, success: true }
}
