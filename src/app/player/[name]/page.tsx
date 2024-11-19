import { Metadata } from 'next'

import { PlayerPage } from '@/features/player'
import { MockPlayerResponse } from '@/mock/ranking'

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const name = decodeURI((await params).name)

  return {
    title: `${name}さんのページ`,
    description: `${name}さんの記録を閲覧します`,
  }
}

export default async function Page({ params }: PageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name } = await params

  // TODO: この name をもとに対象Playerのデータをfetchする
  const player = MockPlayerResponse
  return <PlayerPage player={player} />
}
