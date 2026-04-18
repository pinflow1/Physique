import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Plan, PLAN_CREDITS } from '@/types'

// POST — add credits after confirmed payment
// Called by: Stripe webhook (future) or manual admin top-up
export async function POST(request: NextRequest) {
  try {
    // Verify shared secret — must match INTERNAL_SECRET env var
    const secret = request.headers.get('x-internal-secret')
    if (!secret || secret !== process.env.INTERNAL_SECRET) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!process.env.INTERNAL_SECRET) {
      console.error('INTERNAL_SECRET env var not set')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { userId, plan } = body as { userId?: string; plan?: Plan }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }
    if (!plan || !['basic', 'pro', 'elite'].includes(plan)) {
      return NextResponse.json({ error: 'plan must be basic, pro, or elite' }, { status: 400 })
    }

    const creditsToAdd = PLAN_CREDITS[plan]

    const supabase = await createServiceClient()

    // Get current credits
    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('credits, email')
      .eq('id', userId)
      .single()

    if (fetchErr || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update plan and add credits
    const { error: updateErr } = await supabase
      .from('users')
      .update({ plan, credits: userData.credits + creditsToAdd })
      .eq('id', userId)

    if (updateErr) {
      console.error('Credits update error:', updateErr)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }

    // Log the credit transaction
    const { error: txErr } = await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: creditsToAdd,
      type: 'credit',
      description: `${plan} plan purchase — ${creditsToAdd} credits added`,
    })

    if (txErr) {
      console.error('Transaction log error (non-fatal):', txErr)
    }

    console.log(`Credits added: user=${userId} plan=${plan} credits=${creditsToAdd}`)

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
      newTotal: userData.credits + creditsToAdd,
    })
  } catch (err) {
    console.error('Credits POST unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET — fetch current user's credits (authenticated)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: fetchErr } = await supabase
      .from('users')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (fetchErr || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ credits: userData.credits, plan: userData.plan })
  } catch (err) {
    console.error('Credits GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
