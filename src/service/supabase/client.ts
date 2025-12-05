/** biome-ignore-all lint/style/noNonNullAssertion: 環境変数はある前提とする */
import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/database.types'

// Browser client for authentication in Client Components
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
