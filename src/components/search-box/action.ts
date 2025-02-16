'use server'

import { fetchPlayerNames } from '@/service/supabase/player'

const action = async () => {
  'use cache'
  return await fetchPlayerNames()
}

export default action
