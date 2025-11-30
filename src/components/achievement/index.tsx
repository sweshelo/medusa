import Image from 'next/image'
import { useMemo } from 'react'

import type { Achievement } from '@/types/achievement'
import { sanitizeHTML } from '@/utils/sanitize'

import { Shiny } from '../common/shiny'

const BaseURL =
  'https://eacache.s.konaminet.jp/game/chase2jokers/ccj/images/ranking/title_icon/'
const Icons = [
  '01jan.png',
  '02feb.png',
  '03mar.png',
  '04apr.png',
  '05may.png',
  '06jun.png',
  '07jul.png',
  '08aug.png',
  '09sep.png',
  '10oct.png',
  '11nov.png',
  '12dec.png',
  'tower.png',
  'preyo.png',
  'towerha.png',
  'kac2023.png',
  'towerkyu.png',
  'kac.png',
  'kacyo.png',
]

interface AchievementProps {
  achievement: Achievement | string
}

export const AchievementView = ({ achievement }: AchievementProps) => {
  // レンダリング時にもサニタイズを実施
  const sanitizedMarkup = useMemo(
    () =>
      typeof achievement === 'string' ? null : sanitizeHTML(achievement.markup),
    [achievement],
  )

  if (typeof achievement === 'string') {
    return (
      <div className="bg-silver-gradient text-center">
        <span>{achievement}</span>
      </div>
    )
  }

  if (!achievement.markup || achievement.markup === achievement.title) {
    return (
      <div className="bg-silver-gradient text-center">
        <span>{achievement.title}</span>
      </div>
    )
  }

  const color = (() => {
    if (achievement.icon_last) return 'shiny-rainbow'
    if (achievement.icon_first) return 'shiny-gold'
    return 'shiny-silver'
  })()

  return (
    <Shiny color={color} className="p-1 rounded-sm shadow-sm">
      <div className="flex justify-center items-center">
        {achievement.icon_first && (
          <Image
            src={`${BaseURL}${Icons[parseInt(achievement.icon_first, 10) - 1]}`}
            alt=""
            width={22}
            height={22}
            unoptimized
          />
        )}
        <span
          // biome-ignore lint/security/noDangerouslySetInnerHtml: レンダリング時に厳格なサニタイゼーションを実施済み (sanitize.ts参照)
          dangerouslySetInnerHTML={{ __html: sanitizedMarkup || '' }}
          className="font-bold px-2"
          style={{
            letterSpacing: '2px',
            color: 'white',
            textShadow: 'black 0 1px 4px',
          }}
        />
        {achievement.icon_last && (
          <Image
            src={`${BaseURL}${Icons[parseInt(achievement.icon_last, 10) - 1]}`}
            alt=""
            width={22}
            height={22}
            unoptimized
          />
        )}
      </div>
    </Shiny>
  )
}
