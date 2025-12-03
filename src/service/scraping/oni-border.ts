'use server'

import * as cheerio from 'cheerio'
import { unstable_cache } from 'next/cache'

export interface Border {
  top: number | undefined
  bottom: number | undefined
}

export const getOniBorder = unstable_cache(
  async (): Promise<Border> => {
    const response = await fetch(
      'https://p.eagate.573.jp/game/chase2jokers/ccj/ranking/index.html',
    )
    const html = await response.text()

    const $ = cheerio.load(html)
    const topMatch = $('#ranking_data > li:nth-child(5) > div:nth-child(3)')
      .text()
      .match(/\d+/)?.[0]
    const bottomMatch = $('#ranking_data > li:nth-child(6) > div:nth-child(3)')
      .text()
      .match(/\d+/)?.[0]

    const topValue = topMatch ? Number(topMatch) : undefined
    const bottomValue = bottomMatch ? Number(bottomMatch) : undefined

    const gauge = {
      top: Number.isNaN(topValue) ? undefined : topValue,
      bottom: Number.isNaN(bottomValue) ? undefined : bottomValue,
    }

    return gauge
  },
  ['oni-border'],
  {
    revalidate: 3600, // 1時間
  },
)

console.log(await getOniBorder())
