import { fetchPlayerWithRecord } from '@/service/supabase/player'

const action = async () => {
  return await fetchPlayerWithRecord()
}

export default action
