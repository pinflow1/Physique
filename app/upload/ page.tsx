'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'

type Mode = 'single' | 'comparison'

export default function UploadPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<Mode>('single')
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [currentPreview, setCurrentPreview] = useState<string | null>(null)
  const [goalFile, setGoalFile] = useState<File | null>(null)
  const [goalPreview, setGoalPreview] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onDropCurrent = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return
    setCurrentFile(f); setCurrentPreview(URL.createObjectURL(f))
  }, [])
  const onDropGoal = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return
    setGoalFile(f); setGoalPreview(URL.createObjectURL(f))
  }, [])

  const { getRootProps: rp1, getInputProps: ip1, isDragActive: d1 } = useDropzone({ onDrop: onDropCurrent, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10 * 1024 * 1024 })
  const { getRootProps: rp2, getInputProps: ip2, isDragActive: d2 } = useDropzone({ onDrop: onDropGoal, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10 * 1024 * 1024 })

  async function handleSubmit() {
    if (!currentFile || !consent) return
    setLoading(true); setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      const form = new FormData()
      form.append('currentImage', currentFile)
      form.append('consent', 'true')
      if (mode === 'comparison' && goalFile) form.append('goalImage', goalFile)
      const res = await fetch('/api/analyze', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` }, body: form })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Analysis failed. Please try again.'); setLoading(false); return }
      router.push(`/results/${data.scanId}`)
    } catch { setError('Network error. Please try again.'); setLoading(false) }
  }

  const canSubmit = consent && !!currentFile && (mode === 'comparison' ? !!goalFile : true)
  const cost = mode === 'comparison' ? 4 : 1
  const s = { fontFamily: "'DM Sans',system-ui,sans-serif" }

  const dropStyle = (active: boolean, hasFile: boolean) => ({
    aspectRatio: '3/4' as any,
    maxHeight: '260px',
    border: `2px dashed ${active ? 'var(--text)' : 'var(--border-2)'}`,
    borderRadius: '16px',
    display: 'flex', flexDirection: 'column' as any,
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.15s',
    background: active ? 'var(--card-3)' : 'var(--card-2)',
    position: 'relative' as any, overflow: 'hidden',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', ...s }}>
      <nav className="nav">
        <Link href="/dashboard" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>← Dashboard</Link>
        <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PhysiQ</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>New Scan</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: '24px' }}>Upload your photo for a personalized AI analysis.</p>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '14px', padding: '4px', marginBottom: '24px' }}>
          {(['single', 'comparison'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 6px', borderRadius: '10px', border: 'none', background: mode === m ? 'var(--card)' : 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: mode === m ? 'var(--text)' : 'var(--text-3)', boxShadow: mode === m ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s' }}>
              {m === 'single' ? '📷 Single Scan' : '🎯 Goal Comparison'}
              <span style={{ fontSize: '0.62rem', opacity: 0.6 }}>{m === 'single' ? '1 cr' : '4 cr'}</span>
            </button>
          ))}
        </div>

        {/* Drop zones */}
        <div style={{ display: 'grid', gridTemplateColumns: mode === 'comparison' ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '20px', maxWidth: mode === 'comparison' ? '100%' : '200px', margin: '0 auto 20px' }}>
          <div>
            <p style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              {mode === 'comparison' ? 'Your Current Physique' : 'Your Photo'}
            </p>
            {currentPreview ? (
              <div style={{ ...dropStyle(false, true), cursor: 'default' }}>
                <img src={currentPreview} alt="current" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => { setCurrentFile(null); setCurrentPreview(null) }} style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            ) : (
              <div {...rp1()} style={dropStyle(d1, false)}>
                <input {...ip1()} />
                <div style={{ fontSize: '1.8rem', opacity: 0.25, marginBottom: '10px' }}>📤</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', textAlign: 'center', padding: '0 12px' }}>Drop or tap to upload</p>
                <p style={{ fontSize: '0.67rem', color: 'var(--text-4)', marginTop: '4px' }}>JPG, PNG, WEBP · 10MB</p>
              </div>
            )}
          </div>

          {mode === 'comparison' && (
            <div>
              <p style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Goal Physique</p>
              {goalPreview ? (
                <div style={{ ...dropStyle(false, true), cursor: 'default' }}>
                  <img src={goalPreview} alt="goal" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => { setGoalFile(null); setGoalPreview(null) }} style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ) : (
                <div {...rp2()} style={dropStyle(d2, false)}>
                  <input {...ip2()} />
                  <div style={{ fontSize: '1.8rem', opacity: 0.25, marginBottom: '10px' }}>🎯</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', textAlign: 'center', padding: '0 12px' }}>Goal physique reference</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.55, marginBottom: '14px' }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <div><strong style={{ color: 'var(--text-2)' }}>Not medical advice.</strong> All figures are visual estimates only — not clinical measurements.</div>
        </div>

        {/* Consent */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '20px' }} onClick={() => setConsent(c => !c)}>
          <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${consent ? 'var(--accent)' : 'var(--border-2)'}`, background: consent ? 'var(--accent)' : 'transparent', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
            {consent && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="var(--accent-fg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span style={{ fontSize: '0.79rem', color: 'var(--text-3)', lineHeight: 1.5 }}>I understand this is not medical advice and consent to AI analysis of my uploaded image.</span>
        </label>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', padding: '12px 14px', borderRadius: '10px', marginBottom: '14px' }}>{error}</div>
        )}

        <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-gloss btn-primary"
          style={{ width: '100%', borderRadius: '14px', padding: '14px', fontSize: '0.88rem', opacity: !canSubmit || loading ? 0.35 : 1, cursor: !canSubmit || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? <><span className="spinner" style={{ borderTopColor: 'var(--accent-fg)' }} /> Analyzing…</> : <>🔒 Analyze — {cost} credit{cost > 1 ? 's' : ''}</>}
        </button>
        {loading && <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-4)', marginTop: '8px' }}>GPT-4o is analyzing your photo. This takes 20–40 seconds.</p>}
      </div>
    </div>
  )
}
