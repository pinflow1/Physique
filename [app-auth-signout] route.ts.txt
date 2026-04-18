import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Signout error:', err)
  }
  // Always redirect to home regardless of error
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const redirectTo = appUrl && appUrl !== 'http://localhost:3000'
    ? appUrl
    : '/'
  return NextResponse.redirect(new URL(redirectTo, 'http://localhost'), { status: 302 })
}
