'use cache'

import * as cheerio from 'cheerio'
import { format } from 'date-fns'
import { cacheLife } from 'next/cache'
import sanitizeHtml from 'sanitize-html'

import type { Ranking } from '@/types/ranking'

// サーバーサイド用の軽量HTMLサニタイゼーション
// クライアントサイドでも再度サニタイズされるため、基本的な安全性チェックのみ
const sanitizeHTMLServer = (
  html: string | null | undefined,
): string | undefined => {
  if (!html) return undefined

  const allowedTags = ['b', 'span', 'strong', 'em', 'i']
  // Optionally allow style attribute only as previously referenced in comment; here for safety, no attributes:
  const sanitized = sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      // Set allowed attributes per tag, e.g. "span": ["style"] if you want to allow inline styles
      // For now, no attributes allowed
    },
    allowedSchemes: ['http', 'https'],
  })

  return sanitized || undefined
}

const originalPageURL = (index: number, date: Date | undefined) => {
  const month = format(date ?? new Date(), 'yyyyMM')
  return `https://p.eagate.573.jp/game/chase2jokers/ccj/ranking/index.html?page=${index}&rid=${month}`
}

export async function fetchRankingTable(date?: Date) {
  cacheLife('hours')

  const ranking: Ranking[] = []

  await Promise.all(
    [0, 1, 2, 3].map(async (index) => {
      try {
        const html = await (await fetch(originalPageURL(index, date))).text()
        const $ = cheerio.load(html)

        $('#ranking_data')
          .find('li')
          .each((i, element) => {
            if (i === 0) return
            const rank = parseInt(
              $(element).find('div').first().text().trim(),
              10,
            )
            const points = parseInt(
              $(element).find('div').eq(2).text().trim().replace('P', ''),
              10,
            )
            const charaMatch = $(element)
              .find('div')
              .eq(1)
              .find('p')
              .eq(0)
              .find('img')
              .attr('src')
              ?.match(/icon_(\d+)/)
            const chara = charaMatch ? charaMatch[1] : '0'
            const name = $(element)
              .find('div')
              .eq(1)
              .find('p')
              .last()
              .contents()
              .filter(function () {
                return this.type === 'text'
              })
              .text()
              .trim()

            const achievementElement = $(element)
              .find('div')
              .eq(1)
              .find('p')
              .eq(1)
              .find('span')
              .first()
            const achievementTitle = achievementElement.text().trim()
            const icon1 = achievementElement
              .find('span')
              .first()
              .attr('class')
              ?.split(' ')
              .find((className) => className.startsWith('icon_'))
              ?.replace('icon_', '')
            const icon2 = achievementElement
              .find('span')
              .last()
              .attr('class')
              ?.split(' ')
              .find((className) => className.startsWith('icon_'))
              ?.replace('icon_', '')
            achievementElement.find('span.icon').remove()
            const achievementMarkup = sanitizeHTMLServer(
              achievementElement.html()?.trim(),
            )

            ranking.push({
              rank,
              points,
              chara,
              name,
              achievement: {
                title: achievementTitle, // || achievementMarkup || '', // マークアップの構成が色付き/色無しで変わるため、色無しの場合は空文字列となる。
                markup: achievementMarkup,
                icon: {
                  first: icon1 === '0' ? undefined : icon1,
                  last: icon2 === '0' ? undefined : icon2,
                },
              },
            })
          })
      } catch (e) {
        console.error(e)
      }
    }),
  )

  return ranking.length > 0 ? ranking : undefined
}
