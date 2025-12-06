'use server'

import { createClient } from '@/service/supabase/server'

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
