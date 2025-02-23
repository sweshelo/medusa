'use server'

import { fetchAllPlayersName } from '@/service/supabase/player'

const action = async () => {
  return await fetchAllPlayersName()
}

export default action
