import { Record } from './record'

export interface Player {
  ranking: number
  name: string
  points: number
  chara: string
}

export type PlayerDetail = Player & {
  online: boolean
  achievement:
    | string
    | {
        name: string
        html: string
      }
  prefectures: string[]
  effectiveAverage: number
  deviationValue: number
  records: Record[]
}
