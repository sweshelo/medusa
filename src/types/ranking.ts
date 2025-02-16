export interface Ranking {
  rank: number
  points: number
  chara: string
  name: string
  achievement: {
    title: string
    markup?: string
    icon: {
      first?: string
      last?: string
    }
  }
}
