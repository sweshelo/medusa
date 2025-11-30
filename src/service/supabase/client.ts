/** biome-ignore-all lint/style/noNonNullAssertion: 環境変数はある前提とする */
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database.types'

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!,
)
