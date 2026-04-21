import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Surface Supabase errors back to the auth page
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/auth?error=${encodeURIComponent(errorDescription ?? error)}`
    )
  }

  const supabase = await createClient()

  // --- PATH 1: Email confirmation (token_hash + type) ---
  // This is what Supabase sends when user clicks the confirmation email link
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'recovery' | 'invite' | 'email_change',
    })

    if (verifyError) {
      console.error('OTP verify error:', verifyError.message)
      return NextResponse.redirect(
        `${origin}/auth?error=${encodeURIComponent(verifyError.message)}`
      )
    }

    // Verified — go straight to dashboard
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // --- PATH 2: OAuth code exchange (Google, GitHub, magic link) ---
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError.message)
      return NextResponse.redirect(
        `${origin}/auth?error=${encodeURIComponent(exchangeError.message)}`
      )
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Nothing matched — send back to auth with a clear message
  return NextResponse.redirect(`${origin}/auth?error=Invalid+or+expired+link`)
}
