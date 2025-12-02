import { NextResponse } from 'next/server'
import { createClient } from '@/service/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully authenticated, redirect with success parameter
      return NextResponse.redirect(`${requestUrl.origin}${next}?login=success`)
    }
  }

  // Authentication failed, redirect to login with error
  return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
}
