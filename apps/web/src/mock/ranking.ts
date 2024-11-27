import { PlayerDetail } from '../types/player'

export const MockPlayerResponse: PlayerDetail = {
  id: 1,
  name: 'カイル・ハイド',
  achievement: {
    title: 'ウラオキナワの帝王',
    markup:
      '<span class="icon_0 icon"></span>ウラオキナワの<span style="color:#ff2c9a;">帝王</span><span class="icon_0 icon"></span>',
    icon: {},
  },
  chara: '8',
  points: 78991,
  ranking: 1,
  online: false,
  records: [
    {
      id: 7791921,
      player_name: 'カイル・ハイド',
      ranking: 1,
      achievement: 'ウラオキナワの帝王',
      chara: '8',
      point: 78991,
      diff: 209,

      elapsed: 120,
      recorded_at: '2024-11-17T11:18:00.000Z',
      created_at: '2024-11-17T11:18:00.000Z',
    },
  ],
  average: 210,
  effective_average: 209.9,
  deviation_value: 62.52,
  created_at: '',
  updated_at: '',
}
