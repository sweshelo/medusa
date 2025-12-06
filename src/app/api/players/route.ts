import { NextResponse } from 'next/server'
import { fetchAllPlayersName } from '@/service/supabase/player'

export async function GET() {
  try {
    const players = await fetchAllPlayersName()
    return NextResponse.json(players)
  } catch (error) {
    console.error('Failed to fetch players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 },
    )
  }
}
