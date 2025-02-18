import { OnlinePlayers } from '@/features/online'
import { fetchOnlinePlayers } from '@/service/supabase/online'

export default async function Page() {
  const players = await fetchOnlinePlayers()
  return <OnlinePlayers players={players} />
}
