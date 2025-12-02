import { createClient } from '@/service/supabase/server'

import { Drawer } from '.'

export async function DrawerWrapper() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <Drawer user={user} />
}
