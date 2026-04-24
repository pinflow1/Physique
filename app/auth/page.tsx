'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Bolivia','Bosnia','Botswana',
  'Brazil','Bulgaria','Cambodia','Cameroon','Canada','Chile','China','Colombia','Congo',
  'Costa Rica','Croatia','Cuba','Czech Republic','Denmark','Dominican Republic','Ecuador',
  'Egypt','El Salvador','Estonia','Ethiopia','Finland','France','Georgia','Germany','Ghana',
  'Greece','Guatemala','Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait',
  'Latvia','Lebanon','Libya','Lithuania','Malaysia','Mexico','Morocco','Mozambique',
  'Myanmar','Nepal','Netherlands','New Zealand','Nicaragua','Nigeria','Norway','Oman',
  'Pakistan','Panama','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
  'Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Singapore','Slovakia',
  'Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden',
  'Switzerland','Syria','Taiwan','Tanzania','Thailand','Tunisia','Turkey','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
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
  const [privacy, setPrivacy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()
  const redirectTo = params.get('redirectTo') || '/dashboard'
  const authError = params.get('error')

  const s = { fontFamily: "'DM Sans',system-ui,sans-serif" }
  const inputStyle = {
    width: '100%', background: 'var(--card-3)', border: '1px solid var(--border)',
    color: 'var(--text)', borderRadius: '12px', padding: '12px 16px',
    fontSize: '0.87rem', fontFamily: "'DM Sans',sans-serif", outline: 'none',
    transition: 'border-color 0.15s', display: 'block',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.68rem', fontWeight: 600,
    color: 'var(--text-3)', textTransform: 'uppercase' as const,
    letterSpacing: '0.06em', marginBottom: '6px',
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')

    if (tab === 'signup') {
      if (!phone.trim()) { setError('Phone number is required.'); setLoading(false); return }
      if (!country) { setError('Please select your country.'); setLoading(false); return }
      if (!privacy) { setError('You must accept the Privacy Policy to continue.'); setLoading(false); return }

      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { phone, country, privacy_accepted: true, privacy_accepted_at: new Date().toISOString() },
        },
      })
      if (error) {
        setError(error.message.includes('already registered')
          ? 'An account with this email already exists. Sign in instead.'
          : error.message)
      } else {
        setSuccess('Account created! Check your email for a confirmation link.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(
          error.message.includes('Invalid login credentials') ? 'Incorrect email or password.' :
          error.message.includes('Email not confirmed') ? 'Please confirm your email before signing in.' :
          error.message
        )
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', ...s }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>PhysiQ</Link>
          <p style={{ fontSize: '0.81rem', color: 'var(--text-3)', marginTop: '4px' }}>
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="card-raised" style={{ padding: '28px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--card-3)', borderRadius: '12px', padding: '3px', marginBottom: '20px' }}>
            {(['signin', 'signup'] as const).map(t => (
              <button key={t} type="button"
                onClick={() => { setTab(t); setError(''); setSuccess('') }}
                style={{ flex: 1, padding: '9px', borderRadius: '10px', border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: tab === t ? 'var(--card)' : 'transparent', color: tab === t ? 'var(--text)' : 'var(--text-3)', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none' }}>
                {t === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {authError && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', padding: '12px 14px', borderRadius: '10px', marginBottom: '14px' }}>
              {decodeURIComponent(authError)}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} placeholder="Min. 8 characters" style={inputStyle} />
            </div>

            {tab === 'signup' && (
              <>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+1 234 567 8900" autoComplete="tel" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} required style={{ ...inputStyle, appearance: 'none' as any, cursor: 'pointer' }}>
                    <option value="" disabled>Select your country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }} onClick={() => setPrivacy(v => !v)}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${privacy ? 'var(--accent)' : 'var(--border-2)'}`, background: privacy ? 'var(--accent)' : 'transparent', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    {privacy && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="var(--accent-fg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <Link href="/privacy" onClick={e => e.stopPropagation()} target="_blank" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>Privacy Policy</Link>
                    {' '}and consent to AI analysis of my images. I understand this is not medical advice.
                  </span>
                </label>
              </>
            )}

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', padding: '12px 14px', borderRadius: '10px' }}>{error}</div>
            )}
            {success && (
              <div style={{ background: 'var(--card-3)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: '0.78rem', padding: '12px 14px', borderRadius: '10px' }}>{success}</div>
            )}

            <button type="submit" disabled={loading} className="btn-gloss btn-primary"
              style={{ borderRadius: '12px', padding: '13px', fontSize: '0.88rem', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <span className="spinner" /> : tab === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-4)', marginTop: '16px' }}>
          Not medical advice · Results are visual estimates only
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <AuthForm />
    </Suspense>
  )
}
