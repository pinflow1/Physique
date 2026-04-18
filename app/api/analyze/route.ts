import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { analyzePhysique, compressImageToBase64 } from '@/lib/ai'
import { SCAN_COSTS, ScanType } from '@/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()

    // ── 1. Authenticate ──────────────────────────────────────────────
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── 2. Parse & read ALL buffers ONCE up-front ────────────────────
    // File.arrayBuffer() is a one-shot stream — must read before any await branching
    const formData = await request.formData()
    const currentImageFile = formData.get('currentImage') as File | null
    const goalImageFile = formData.get('goalImage') as File | null
    const consentGiven = formData.get('consent') === 'true'

    if (!currentImageFile) {
      return NextResponse.json({ error: 'Current image required' }, { status: 400 })
    }
    if (!consentGiven) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    }

    // Validate MIME types server-side (never trust client)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(currentImageFile.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, or WEBP.' }, { status: 400 })
    }
    if (goalImageFile && !allowedTypes.includes(goalImageFile.type)) {
      return NextResponse.json({ error: 'Invalid goal image type. Use JPG, PNG, or WEBP.' }, { status: 400 })
    }

    // Validate sizes (10 MB max)
    const MAX_BYTES = 10 * 1024 * 1024
    if (currentImageFile.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Current image too large. Max 10 MB.' }, { status: 400 })
    }
    if (goalImageFile && goalImageFile.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Goal image too large. Max 10 MB.' }, { status: 400 })
    }

    // Read buffers NOW — before any other async operations
    const currentBuffer = Buffer.from(await currentImageFile.arrayBuffer())
    const goalBuffer = goalImageFile ? Buffer.from(await goalImageFile.arrayBuffer()) : null

    // ── 3. Scan type & cost ──────────────────────────────────────────
    const scanType: ScanType = goalBuffer ? 'comparison' : 'single'
    const creditCost = SCAN_COSTS[scanType]

    // ── 4. Verify user & credits ─────────────────────────────────────
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (scanType === 'comparison' && userData.plan === 'basic') {
      return NextResponse.json({ error: 'Goal comparison requires Pro or Elite plan' }, { status: 403 })
    }
    if (userData.credits < creditCost) {
      return NextResponse.json(
        { error: `Insufficient credits. Need ${creditCost}, have ${userData.credits}.` },
        { status: 402 }
      )
    }

    // ── 5. Rate limit — 1 scan per 60s per user ──────────────────────
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString()
    const { count: recentCount } = await supabase
      .from('scans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['processing', 'complete'])
      .gte('created_at', oneMinuteAgo)

    if (recentCount && recentCount > 0) {
      return NextResponse.json({ error: 'Please wait 1 minute between scans.' }, { status: 429 })
    }

    // ── 6. Upload to private Supabase Storage ────────────────────────
    // Bucket is PRIVATE — store paths only, generate signed URLs when reading
    const ts = Date.now()
    const currentPath = `${user.id}/${ts}-current.jpg`

    const { error: uploadErr } = await supabase.storage
      .from('physique-images')
      .upload(currentPath, currentBuffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      console.error('Upload error:', uploadErr)
      return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
    }

    let goalPath: string | undefined

    if (goalBuffer && goalImageFile) {
      goalPath = `${user.id}/${ts}-goal.jpg`
      const { error: goalUploadErr } = await supabase.storage
        .from('physique-images')
        .upload(goalPath, goalBuffer, { contentType: 'image/jpeg', upsert: false })

      if (goalUploadErr) {
        console.error('Goal upload error:', goalUploadErr)
        await supabase.storage.from('physique-images').remove([currentPath])
        return NextResponse.json({ error: 'Goal image upload failed' }, { status: 500 })
      }
    }

    // ── 7. Create scan record (status: processing) ───────────────────
    const { data: scan, error: scanInsertErr } = await supabase
      .from('scans')
      .insert({
        user_id: user.id,
        scan_type: scanType,
        current_image_path: currentPath,
        goal_image_path: goalPath ?? null,
        credits_used: creditCost,
        status: 'processing',
      })
      .select()
      .single()

    if (scanInsertErr || !scan) {
      console.error('Scan insert error:', scanInsertErr)
      await supabase.storage.from('physique-images').remove([currentPath, ...(goalPath ? [goalPath] : [])])
      return NextResponse.json({ error: 'Failed to create scan' }, { status: 500 })
    }

    // ── 8. Compress images for AI (use pre-read buffers) ─────────────
    const { base64: currentB64, mime: currentMime } =
      await compressImageToBase64(currentBuffer, currentImageFile.type)

    let goalB64: string | undefined
    let goalMime: string | undefined

    if (goalBuffer && goalImageFile) {
      const g = await compressImageToBase64(goalBuffer, goalImageFile.type)
      goalB64 = g.base64
      goalMime = g.mime
    }

    // ── 9. Call GPT-4o ───────────────────────────────────────────────
    let result
    try {
      result = await analyzePhysique(currentB64, currentMime, goalB64, goalMime)
    } catch (aiErr) {
      console.error('AI error:', aiErr)
      await supabase.from('scans').update({ status: 'failed' }).eq('id', scan.id)
      return NextResponse.json({ error: 'AI analysis failed. Please try again.' }, { status: 500 })
    }

    // ── 10. Deduct credits atomically (conditional update) ────────────
    // Only succeeds if credits haven't changed since we checked — prevents race conditions
    const { error: deductErr, count: deductedRows } = await supabase
      .from('users')
      .update({ credits: userData.credits - creditCost })
      .eq('id', user.id)
      .gte('credits', creditCost)
      .select('id', { count: 'exact', head: true })

    if (deductErr || !deductedRows || deductedRows === 0) {
      // Race condition: someone else used credits between our check and now
      console.error('Credit deduction race condition or error:', deductErr)
      await supabase.from('scans').update({ status: 'failed' }).eq('id', scan.id)
      return NextResponse.json({ error: 'Credit deduction failed. Please try again.' }, { status: 500 })
    }

    // ── 11. Log transaction ──────────────────────────────────────────
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -creditCost,
      type: 'debit',
      description: `${scanType === 'comparison' ? 'Goal comparison' : 'Physique'} scan`,
      scan_id: scan.id,
    })

    // ── 12. Save result ──────────────────────────────────────────────
    const { error: resultErr } = await supabase
      .from('scans')
      .update({ status: 'complete', result })
      .eq('id', scan.id)

    if (resultErr) {
      console.error('Result save error — scan complete but result not stored:', resultErr)
    }

    return NextResponse.json({
      scanId: scan.id,
      result,
      creditsRemaining: userData.credits - creditCost,
    })
  } catch (err) {
    console.error('Unhandled analyze error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
