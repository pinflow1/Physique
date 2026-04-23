import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Never intercept the callback — it needs to run freely to exchange tokens
  if (pathname.startsWith('/auth/callback')) {
    return supabaseResponse
  }

  // Known public routes — always allow
  const publicRoutes = ['/', '/auth', '/pricing', '/privacy']
  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith(r))

  // Known app routes — require auth
  const protectedRoutes = ['/dashboard', '/upload', '/results']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

  // Known API routes — let them handle their own auth
  const isApi = pathname.startsWith('/api/')

  // If protected and not logged in → send to sign in
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // If already logged in and hitting /auth → send to dashboard
  if (user && pathname === '/auth') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.searchParams.delete('redirectTo')
    return NextResponse.redirect(url)
  }

  // Unknown route that isn't public or API → redirect to sign in instead of 404
  if (!isPublic && !isProtected && !isApi) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
