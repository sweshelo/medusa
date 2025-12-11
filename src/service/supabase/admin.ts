import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database.types'

/**
 * Admin client for privileged operations that bypass RLS.
 * Should ONLY be used in server-side contexts where full database access is required,
 * such as webhooks or administrative operations.
 *
 * WARNING: This client bypasses all Row Level Security policies.
 * Do NOT use this for regular user-scoped operations.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not set in environment variables')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set in environment variables',
    )
  }

  return createClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
