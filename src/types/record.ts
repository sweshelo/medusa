import type { Database } from './database.types'

export type Record = Database['public']['Tables']['record']['Row']

export interface RankRecord {
  id: number
  chara: string
  point: number
  diff: number | null
  recorded_at: string | null
  elapsed: number | null
  version: string | null
}
