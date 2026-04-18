import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    const url = new URL('/auth', origin)
    url.searchParams.set('error', error)
    return NextResponse.redirect(url.toString())
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=no_code', origin).toString())
  }

  try {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(new URL('/auth?error=exchange_failed', origin).toString())
    }

    return NextResponse.redirect(new URL('/dashboard', origin).toString())
  } catch (err) {
    console.error('Auth callback unhandled error:', err)
    return NextResponse.redirect(new URL('/auth?error=server_error', origin).toString())
  }
}
