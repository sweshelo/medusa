import { Database } from './database.types'

export type Achievement =
  | Database['public']['Tables']['achievement']['Row']
  | Database['public']['Tables']['record']['Row']['achievement']
