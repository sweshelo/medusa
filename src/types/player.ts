import { Database } from './database.types'
import { Record } from './record'

export type Player = Database['public']['Tables']['player']['Row']
export type PlayerDetail = Player & {
  achievement: {
    title: string
    markup: string
    icon: {
      first?: string
      last?: string
    }
  }
  chara: string
  points: number
  ranking: number
  online: boolean
  records: Record[]
}
