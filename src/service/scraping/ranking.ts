'use cache'

import * as cheerio from 'cheerio'
import { cacheLife } from 'next/cache'
import { ANNONYMOUS } from '@/constants/name'

export interface Border {
  top: number | undefined
  bottom: number | undefined
}

const CCJ_RANKING_PAGE =
  'https://p.eagate.573.jp/game/chase2jokers/ccj/ranking/index.html'

export async function getOniBorder(): Promise<Border> {
  cacheLife('hours') // 1時間

  const response = await fetch(CCJ_RANKING_PAGE)
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
}

export async function getRankers(): Promise<string[]> {
  cacheLife('hours') // 1時間

  const result = await Promise.all(
    [0, 1, 2, 3].map(async (index) => {
      try {
        const response = await fetch(`${CCJ_RANKING_PAGE}?page=${index}`)
        const html = await response.text()

        const $ = cheerio.load(html)
        const elements = $(
          '#ranking_data > li:not(:first-child) > div:nth-child(2) > p:nth-child(2)',
        )

        // テキストノードだけ抽出
        const textNodes = elements
          .map((_, el) => {
            return $(el)
              .contents()
              .filter((_, node) => node.type === 'text')
              .map((_, textNode) => $(textNode).text().trim())
              .get()
          })
          .get()

        return textNodes
      } catch (e) {
        console.error(e)
        return []
      }
    }),
  )

  return result.flat().filter((name) => name !== ANNONYMOUS)
}
