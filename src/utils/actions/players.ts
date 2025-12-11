'use server'

import { fetchAllPlayersName } from '@/service/supabase/player'

export const getAllPlayersName = async (): Promise<string[]> => {
  try {
    const players = await fetchAllPlayersName()
    return players
  } catch (error) {
    console.error('Failed to fetch players:', error)
    return []
  }
}
