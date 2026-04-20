'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [tab, setTab] = useState<'signin' | 'signup'>(
    params.get('tab') === 'signup' ? 'signup' : 'signin'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  // Where to go after login — respect ?redirectTo param
  const redirectTo = params.get('redirectTo') || '/dashboard'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (tab === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email for a confirmation link before signing in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // Give a user-friendly message instead of raw Supabase error
        if (error.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.')
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

  return (
    <div
      className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-5"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
    >
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-block text-[1.55rem] font-extrabold tracking-tight mb-1.5"
          >
            Physi
            <span
              style={{
                background: 'linear-gradient(135deg,#a882ff,#6eb3ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Q
            </span>
          </Link>
          <p className="text-[.81rem] text-[#9494b8]">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[24px] p-7 shadow-2xl">
          {/* Tab switcher */}
          <div className="flex bg-white/[0.08] rounded-xl p-1 mb-5">
            {(['signin', 'signup'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t)
                  setError('')
                  setSuccess('')
                }}
                className={`flex-1 py-2 rounded-[10px] text-[.79rem] font-bold transition-all cursor-pointer ${
                  tab === t
                    ? 'bg-[#1c1c2e] text-[#f0f0ff] shadow-lg'
                    : 'text-[#9494b8]'
                }`}
              >
                {t === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* OAuth error from callback */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[.78rem] px-4 py-3 rounded-xl mb-4">
              Authentication failed. Please try again.
            </div>
          )}

          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label className="block text-[.68rem] font-semibold text-[#9494b8] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-white/[0.08] border border-white/[0.14] text-[#f0f0ff] rounded-xl px-3.5 py-3 text-[.84rem] outline-none transition-all placeholder:text-[#55556e] focus:border-[#a882ff]"
              />
            </div>
            <div>
              <label className="block text-[.68rem] font-semibold text-[#9494b8] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                placeholder="Min. 8 characters"
                className="w-full bg-white/[0.08] border border-white/[0.14] text-[#f0f0ff] rounded-xl px-3.5 py-3 text-[.84rem] outline-none transition-all placeholder:text-[#55556e] focus:border-[#a882ff]"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[.78rem] px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div
                className="text-[.78rem] px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(168,130,255,0.1)',
                  border: '1px solid rgba(168,130,255,0.2)',
                  color: '#a882ff',
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl text-[.87rem] flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : tab === 'signin' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[.7rem] text-[#55556e] mt-4">
          Not medical advice. Results are visual estimates only.
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
