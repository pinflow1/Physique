'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Bolivia',
  'Bosnia','Botswana','Brazil','Bulgaria','Cambodia','Cameroon','Canada','Chile',
  'China','Colombia','Congo','Costa Rica','Croatia','Cuba','Czech Republic',
  'Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia',
  'Ethiopia','Finland','France','Georgia','Germany','Ghana','Greece','Guatemala',
  'Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait',
  'Latvia','Lebanon','Libya','Lithuania','Malaysia','Mexico','Morocco',
  'Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Nigeria','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines',
  'Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia',
  'Senegal','Serbia','Singapore','Slovakia','Slovenia','Somalia','South Africa',
  'South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria',
  'Taiwan','Tanzania','Thailand','Tunisia','Turkey','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [tab, setTab] = useState<'signin' | 'signup'>(
    params.get('tab') === 'signup' ? 'signup' : 'signin'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()
  const redirectTo = params.get('redirectTo') || '/dashboard'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (tab === 'signup') {
      // Validate required signup fields
      if (!phone.trim()) {
        setError('Phone number is required.')
        setLoading(false)
        return
      }
      if (!country) {
        setError('Please select your country.')
        setLoading(false)
        return
      }
      if (!privacyAccepted) {
        setError('You must accept the Privacy Policy to continue.')
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            phone,
            country,
            privacy_accepted: true,
            privacy_accepted_at: new Date().toISOString(),
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Sign in instead.')
        } else {
          setError(error.message)
        }
      } else {
        setSuccess('Account created! Check your email for a confirmation link, then sign in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in. Check your inbox.')
        } else {
          setError(error.message)
        }
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    }
    setLoading(false)
  }

  const authError = params.get('error')

  const inputCls = "w-full bg-white/[0.08] border border-white/[0.14] text-[#f0f0ff] rounded-xl px-3.5 py-3 text-[.84rem] font-['Plus_Jakarta_Sans',system-ui,sans-serif] outline-none transition-all placeholder:text-[#55556e] focus:border-[#a882ff]"
  const labelCls = "block text-[.68rem] font-semibold text-[#9494b8] uppercase tracking-wider mb-1.5"

  return (
    <div
      className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-5 py-10"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
    >
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-[1.55rem] font-extrabold tracking-tight mb-1.5">
            Physi<span style={{ background:'linear-gradient(135deg,#a882ff,#6eb3ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Q</span>
          </Link>
          <p className="text-[.81rem] text-[#9494b8]">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[24px] p-7 shadow-2xl">

          {/* Tabs */}
          <div className="flex bg-white/[0.08] rounded-xl p-1 mb-5">
            {(['signin','signup'] as const).map(t => (
              <button key={t} type="button"
                onClick={() => { setTab(t); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-[10px] text-[.79rem] font-bold transition-all cursor-pointer ${tab===t ? 'bg-[#1c1c2e] text-[#f0f0ff] shadow-lg' : 'text-[#9494b8]'}`}>
                {t === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* OAuth / callback error */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[.78rem] px-4 py-3 rounded-xl mb-4">
              {decodeURIComponent(authError)}. Please try again.
            </div>
          )}

          <form onSubmit={submit} className="space-y-3.5">

            {/* Email */}
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" placeholder="you@example.com" className={inputCls} />
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8}
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                placeholder="Min. 8 characters" className={inputCls} />
            </div>

            {/* Signup-only fields */}
            {tab === 'signup' && (
              <>
                {/* Phone */}
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    required placeholder="+1 234 567 8900"
                    autoComplete="tel" className={inputCls} />
                </div>

                {/* Country */}
                <div>
                  <label className={labelCls}>Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} required
                    className={inputCls + ' appearance-none cursor-pointer'}
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <option value="" disabled style={{ background: '#1c1c2e' }}>Select your country</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c} style={{ background: '#1c1c2e' }}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Privacy Policy */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-1"
                  onClick={() => setPrivacyAccepted(v => !v)}>
                  <div className={`w-5 h-5 rounded-[6px] border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${privacyAccepted ? 'border-transparent' : 'border-white/[0.25]'}`}
                    style={privacyAccepted ? { background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' } : {}}>
                    {privacyAccepted && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[.76rem] text-[#9494b8] leading-relaxed">
                    I agree to the{' '}
                    <Link href="/privacy" className="underline hover:text-[#a882ff] transition-colors"
                      onClick={e => e.stopPropagation()} target="_blank">
                      Privacy Policy
                    </Link>
                    {' '}and consent to the processing of my data including uploaded images. I understand this is not medical advice.
                  </span>
                </label>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[.78rem] px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="text-[.78rem] px-4 py-3 rounded-xl"
                style={{ background:'rgba(168,130,255,0.1)', border:'1px solid rgba(168,130,255,0.2)', color:'#a882ff' }}>
                {success}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl text-[.87rem] flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-1"
              style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : tab === 'signin' ? 'Sign in' : 'Create account'}
            </button>

          </form>
        </div>

        <p className="text-center text-[.7rem] text-[#55556e] mt-4">
          Not medical advice · Results are visual estimates only
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d14]" />}>
      <AuthForm />
    </Suspense>
  )
}
