/** biome-ignore-all lint/style/noNonNullAssertion: 環境変数はある前提とする */
import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database.types'

// Legacy client for existing server-side code (non-auth)
export const supabase = createSupabaseClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// New browser client for authentication in Client Components
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
