import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/database.types'

export const supabase = (tags: string[]) =>
  createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!, {
    global: {
      fetch: (input: RequestInfo | URL, init: RequestInit = {}) =>
        fetch(input, {
          ...init,
          cache: 'force-cache',
          next: { tags, revalidate: 60 * 60 * 24 },
        }),
    },
  })
