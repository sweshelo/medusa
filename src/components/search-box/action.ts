'use server'

import { fetchPlayerWithRecord } from '@/service/supabase/player'

const action = async () => {
  'use cache'
  return await fetchPlayerWithRecord()
}

export default action
