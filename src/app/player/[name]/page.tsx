import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getRankers } from '@/service/scraping/ranking'
import { getPlayerIdByName } from '@/service/supabase/player'

export const metadata: Metadata = {
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateStaticParams() {
  const playerNames = await getRankers()
  return playerNames.map((name) => ({ name: `${name}` }))
}

export default async function Page({ params }: PageProps) {
  const name = decodeURI((await params).name)
  const id = await getPlayerIdByName(name)

  if (id) {
    redirect(`/player/id/${id}`)
  } else {
    notFound()
  }
}
