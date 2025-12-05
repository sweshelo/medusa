import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { PROTECTED_PATH } from '@/constants/protected-path'
import { CURRENT_TERMS_VERSION } from '@/constants/terms'
import type { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({
            request,
          })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 認証が必要なパスにアクセスしたら /login に転送
  if (
    !user &&
    PROTECTED_PATH.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ログイン済みで /login にアクセスしたら TOP に転送
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // 利用規約同意チェック
  if (user && !request.nextUrl.pathname.startsWith('/terms')) {
    // 認証関連ページは除外
    const excludedPaths = [
      '/login',
      '/signup',
      '/auth',
      '/forgot-password',
      '/reset-password',
    ]
    const isExcluded = excludedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    )

    if (!isExcluded) {
      // Cookieから規約同意情報をチェック
      const termsAgreedCookie = request.cookies.get('terms_agreed')

      // Cookieが存在し、最新バージョンと一致する場合はDBチェックをスキップ
      if (termsAgreedCookie?.value === CURRENT_TERMS_VERSION) {
        // Cookieが有効なのでDBアクセスせずにスキップ
      } else {
        // Cookieがないまたはバージョンが古い場合はDBチェック
        const { data: profile } = await supabase
          .from('profiles')
          .select('agreed_terms')
          .eq('id', user.id)
          .single()

        if (
          !profile?.agreed_terms ||
          profile.agreed_terms !== CURRENT_TERMS_VERSION
        ) {
          // 未同意または古いバージョンの場合は規約ページへリダイレクト
          const url = request.nextUrl.clone()
          url.pathname = '/terms'
          url.searchParams.set('redirect', request.nextUrl.pathname)
          return NextResponse.redirect(url)
        } else {
          // DBで同意済みを確認したのでCookieをセット（7日間有効）
          supabaseResponse.cookies.set('terms_agreed', CURRENT_TERMS_VERSION, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7日間
            path: '/',
          })
        }
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}
