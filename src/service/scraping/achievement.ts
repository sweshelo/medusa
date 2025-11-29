import * as cheerio from 'cheerio'

import { CharacterSuffix, MonthTable, YearSuffix } from '@/constants/achievement'

export interface AchievementInfo {
  title: string
  description: string
  tag: string
}

export const fetchAchievementInfomation = async (): Promise<AchievementInfo[]> => {
  const response = await fetch('https://wiki3.jp/chase2jokers/page/31')
  const html = await response.text()

  const $ = cheerio.load(html)

  // 各種テーブル取得
  const [
    common,
    action,
    stage,
    shop,
    tower,
    event,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ranking_year,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ranking_char,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ranking_icon_jan,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ranking_icon_jun,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unknown,
    prefecure,
  ] = [...$('.uk-table')]

  const normal = [
    { table: common, tag: 'common' },
    { table: action, tag: 'action' },
    { table: stage, tag: 'stage' },
    { table: shop, tag: 'shop' },
    { table: tower, tag: 'tower' },
    { table: event, tag: 'event' },
  ].flatMap(({ table, tag }) => {
    return [...$(table).find('tbody > tr')].flatMap(tr => {
      const [titleElm, descriptionElm] = [...$(tr).find('td')]
      return {
        title: $(titleElm).text().trim(),
        description: $(descriptionElm).text().trim(),
        tag,
      }
    })
  })

  const prefecual = [...$(prefecure).find('tbody > tr')].map(tr => {
    const [prefectureElm, titleElm] = [...$(tr).find('td:not([rowspan])')]
    return {
      title: $(titleElm).text().trim(),
      description: `${$(prefectureElm).text().trim()}でプレイした`,
      tag: 'prefecture',
    }
  })

  const ranking = YearSuffix.flatMap(year => {
    return MonthTable.flatMap((month, index) => {
      return CharacterSuffix.flatMap(char => {
        return {
          title: `${month}${year.suffix}${char.suffix}`,
          description: `${year.year}年${index + 1}月のランキングで ${char.char}を使って ${year.isHigher ? '10' : '100'}位以内に ランクインした`,
          tag: 'ranking',
        }
      })
    })
  })

  return [...normal, ...prefecual, ...ranking]
}
