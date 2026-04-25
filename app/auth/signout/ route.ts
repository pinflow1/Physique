import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Signout error:', err)
  }
  // Use the request URL origin — works on any domain including Vercel
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/`, { status: 302 })
}
