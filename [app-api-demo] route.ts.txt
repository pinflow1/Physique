import { NextRequest, NextResponse } from 'next/server'
import { DEMO_RESULT, DEMO_COMPARISON_RESULT } from '@/lib/demo-data'

// Simple rate limit store (resets on serverless cold start — good enough for demo)
const requestLog = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const requests = (requestLog.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  requests.push(now)
  requestLog.set(ip, requests)
  return requests.length > MAX_PER_WINDOW
}

export async function GET(request: NextRequest) {
  // Rate limit by IP to prevent scraping
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'single'

  if (!['single', 'comparison'].includes(type)) {
    return NextResponse.json({ error: 'type must be single or comparison' }, { status: 400 })
  }

  // Simulate realistic AI latency
  await new Promise(r => setTimeout(r, 600))

  return NextResponse.json(
    {
      result: type === 'comparison' ? DEMO_COMPARISON_RESULT : DEMO_RESULT,
      isDemo: true,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache demo for 5 min
      },
    }
  )
}
