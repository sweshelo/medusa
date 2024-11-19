import { DateTime } from './common'

export interface Record {
  timeline_id: number
  player_name: string
  ranking: number
  achievement: string
  chara: string
  points: number
  diff: number
  elapsed: number
  invalid: number
  datetime: {
    date: DateTime
    timeframe: string
  }
  stage: string | null
}
