import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getPlayerIdByName } from '@/service/supabase/player'

export const metadata: Metadata = {
  robots: { index: false },
}

interface PageProps {
  params: Promise<{ name: string }>
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
