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

  const { getRootProps: rp1, getInputProps: ip1, isDragActive: d1 } = useDropzone({ onDrop: onDropCurrent, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10*1024*1024 })
  const { getRootProps: rp2, getInputProps: ip2, isDragActive: d2 } = useDropzone({ onDrop: onDropGoal, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10*1024*1024 })

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

  return (
    <div className="min-h-screen bg-[#0d0d14] text-[#f0f0ff]" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <nav className="sticky top-0 z-50 h-[54px] flex items-center justify-between px-5 border-b border-white/[0.08]" style={{background:'rgba(13,13,20,0.9)',backdropFilter:'blur(20px)'}}>
        <Link href="/dashboard" className="flex items-center gap-2 text-[.77rem] text-[#9494b8] hover:text-white transition-colors">← Dashboard</Link>
        <span className="text-[1rem] font-extrabold tracking-tight">
          Physi<span style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Q</span>
        </span>
        <div className="w-20" />
      </nav>

      <div className="max-w-[540px] mx-auto px-5 py-8">
        <h1 className="text-[1.25rem] font-extrabold tracking-tight mb-1">New Scan</h1>
        <p className="text-[.8rem] text-[#9494b8] mb-6">Upload your photo for a personalized AI analysis.</p>

        {/* Mode toggle */}
        <div className="flex bg-white/[0.08] border border-white/[0.08] rounded-[14px] p-1 mb-6">
          {(['single','comparison'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[.77rem] font-bold transition-all ${mode===m ? 'bg-[#1c1c2e] text-[#f0f0ff] shadow-lg' : 'text-[#9494b8]'}`}>
              {m === 'single' ? '📷 Single Scan' : '🎯 Goal Comparison'}
              <span className="text-[.62rem] opacity-60">{m==='single' ? '1 credit' : '4 credits · Pro+'}</span>
            </button>
          ))}
        </div>

        {/* Drop zones */}
        <div className={`grid gap-3 mb-6 ${mode==='comparison' ? 'grid-cols-2' : 'grid-cols-1 max-w-[200px] mx-auto'}`}>
          <div>
            <p className="text-[.66rem] font-semibold text-[#9494b8] uppercase tracking-wider mb-2">{mode==='comparison' ? 'Your Current Physique' : 'Your Photo'}</p>
            {currentPreview ? (
              <div className="relative rounded-[20px] overflow-hidden border border-white/[0.14]" style={{aspectRatio:'3/4'}}>
                <img src={currentPreview} alt="current" className="w-full h-full object-cover" />
                <button onClick={() => { setCurrentFile(null); setCurrentPreview(null) }} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[.65rem]" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}>✕</button>
              </div>
            ) : (
              <div {...rp1()} className={`flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed cursor-pointer transition-all ${d1 ? 'border-[#a882ff] bg-white/[0.05]' : 'border-white/[0.14] bg-white/[0.05] hover:border-[#a882ff]'}`} style={{aspectRatio:'3/4',maxHeight:'260px'}}>
                <input {...ip1()} />
                <div className="text-[1.8rem] opacity-30 mb-2.5">📤</div>
                <p className="text-[.78rem] text-[#9494b8] text-center px-3">Drop or tap to upload</p>
                <p className="text-[.67rem] text-[#55556e] mt-1">JPG, PNG, WEBP · 10MB</p>
              </div>
            )}
          </div>
          {mode === 'comparison' && (
            <div>
              <p className="text-[.66rem] font-semibold text-[#9494b8] uppercase tracking-wider mb-2">Goal Physique</p>
              {goalPreview ? (
                <div className="relative rounded-[20px] overflow-hidden border border-white/[0.14]" style={{aspectRatio:'3/4'}}>
                  <img src={goalPreview} alt="goal" className="w-full h-full object-cover" />
                  <button onClick={() => { setGoalFile(null); setGoalPreview(null) }} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[.65rem]" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}>✕</button>
                </div>
              ) : (
                <div {...rp2()} className={`flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed cursor-pointer transition-all ${d2 ? 'border-[#a882ff] bg-white/[0.05]' : 'border-white/[0.14] bg-white/[0.05] hover:border-[#a882ff]'}`} style={{aspectRatio:'3/4',maxHeight:'260px'}}>
                  <input {...ip2()} />
                  <div className="text-[1.8rem] opacity-30 mb-2.5">🎯</div>
                  <p className="text-[.78rem] text-[#9494b8] text-center px-3">Goal physique reference</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="rounded-[14px] p-3.5 flex gap-2.5 mb-4 text-[.75rem] text-[#9494b8] leading-relaxed" style={{background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.2)'}}>
          <span className="flex-shrink-0">⚠️</span>
          <div><strong className="text-[#f0f0ff]">Not medical advice.</strong> All figures are visual estimates only — not clinical measurements.</div>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-2.5 cursor-pointer mb-5" onClick={() => setConsent(c => !c)}>
          <div className={`w-5 h-5 rounded-[6px] border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${consent ? 'border-transparent' : 'border-white/[0.14]'}`} style={consent ? {background:'linear-gradient(135deg,#a882ff,#6eb3ff)'} : {}}>
            {consent && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-[.79rem] text-[#9494b8] leading-relaxed">I understand this is not medical advice and consent to AI analysis of my uploaded image.</span>
        </label>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[.78rem] px-4 py-3 rounded-xl mb-4">{error}</div>}

        <button onClick={handleSubmit} disabled={!canSubmit || loading} className="w-full text-white font-bold py-3.5 rounded-[14px] flex items-center justify-center gap-2 text-[.88rem] transition-all disabled:opacity-35 disabled:cursor-not-allowed" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</> : <>🔒 Analyze — {cost} credit{cost > 1 ? 's' : ''}</>}
        </button>
        {loading && <p className="text-center text-[.7rem] text-[#55556e] mt-2">GPT-4o is analyzing your photo. This takes 20–40 seconds.</p>}
      </div>
    </div>
  )
}
