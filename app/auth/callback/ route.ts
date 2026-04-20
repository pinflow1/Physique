import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error)}`)
  }

  const supabase = await createClient()

  // Handle email confirmation via token_hash (from email template)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (verifyError) {
      console.error('OTP verify error:', verifyError)
      return NextResponse.redirect(`${origin}/auth?error=verification_failed`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Handle OAuth code exchange (Google, GitHub etc)
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/auth?error=exchange_failed`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Nothing matched — send to auth
  return NextResponse.redirect(`${origin}/auth`)
}
