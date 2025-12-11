import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { Revalidater } from '@/components/revalidater'
import { PlayerPage } from '@/features/player'
import { getRankers } from '@/service/scraping/ranking'
import { fetchAchievement } from '@/service/supabase/achievement'
import {
  fetchPlayer,
  fetchRecentPlayedPlayersId,
} from '@/service/supabase/player'

interface PageProps {
  params: Promise<{ id: string }>
}

// Disable static generation to avoid cacheComponents conflicts with complex queries
export async function generateStaticParams() {
  const playerNames = await getRankers()
  const playersId = await fetchRecentPlayedPlayersId(playerNames)
  return playersId.map((id) => ({ id: `${id}` }))
}

async function getPlayerData(playerId: number) {
  'use cache'
  cacheLife('hours') // 1時間

  const player = await fetchPlayer(playerId)
  const achievement = (await fetchAchievement(player.achievement)) ?? undefined
  const timestamp = new Date()
  return { player, achievement, timestamp }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { player } = await getPlayerData(parseInt((await params).id, 10))
  return {
    title: `${player.name}さんのページ`,
    description: `${player.name}さんの記録を閲覧します`,
    robots: {
      index: false,
    },
  }
}

export default async function Page({ params }: PageProps) {
  try {
    const playerId = parseInt((await params).id, 10)
    const { player, achievement, timestamp } = await getPlayerData(playerId)

    return player ? (
      <PlayerPage
        player={player}
        achievement={achievement}
        timestamp={timestamp}
      />
    ) : null
  } catch (e) {
    console.error(e)
    return (
      <div className="bg-white text-center p-2 rounded-lg">
        プレイヤーデータの取得に失敗しました
        <Revalidater />
      </div>
    )
  }
}
