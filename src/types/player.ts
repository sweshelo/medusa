import { Database } from './database.types'
import { Record } from './record'

export type Player = Database['public']['Tables']['player']['Row']
export type PlayerDetail = Player & Record[]
