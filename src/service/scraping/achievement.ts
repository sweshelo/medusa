import * as cheerio from 'cheerio'

import { CharacterSuffix, MonthTable, YearSuffix } from '@/constants/achievement'

export interface AchievementInfo {
  title: string
  description: string
}

export const fetchAchievementInfomation = async (): Promise<AchievementInfo[]> => {
  const response = await fetch('https://wiki3.jp/chase2jokers/page/31')
  const html = await response.text()

  const $ = cheerio.load(html)

  // 各種テーブル取得
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [
    common,
    action,
    stage,
    shop,
    tower,
    event,
    _ranking_year,
    _ranking_char,
    _ranking_icon_jan,
    _ranking_icon_jun,
    _unknown,
    prefecure,
  ] = [...$('.uk-table')]

  const normal = [common, action, stage, shop, tower, event]
    .map(table => {
      return [...$(table).find('tbody > tr')]
        .map(tr => {
          const [titleElm, descriptionElm] = [...$(tr).find('td')]
          return {
            title: $(titleElm).text().trim(),
            description: $(descriptionElm).text().trim(),
          }
        })
        .flat()
    })
    .flat()

  const prefecual = [...$(prefecure).find('tbody > tr')].map(tr => {
    const [prefectureElm, titleElm] = [...$(tr).find('td:not([rowspan])')]
    return {
      title: $(titleElm).text().trim(),
      description: `${$(prefectureElm).text().trim()}でプレイした`,
    }
  })

  const ranking = YearSuffix.flatMap(year => {
    return MonthTable.flatMap((month, index) => {
      return CharacterSuffix.flatMap(char => {
        return {
          title: `${month}${year.suffix}${char.suffix}`,
          description: `${year.year}年${index + 1}月のランキングで ${char.char}を使って ${year.isHigher ? '10' : '100'}位以内に ランクインした`,
        }
      })
    })
  })

  console.info(ranking)

  return [...normal, ...prefecual, ...ranking]
}
