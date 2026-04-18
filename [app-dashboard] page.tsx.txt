import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { User, Scan } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Fetch user record — the trigger creates it on signup, but handle edge cases
  let { data: userData, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // If row doesn't exist yet (trigger may have failed), insert it
  if (userErr || !userData) {
    const { data: inserted } = await supabase
      .from('users')
      .insert({ id: user.id, email: user.email ?? '', plan: 'basic', credits: 0 })
      .select()
      .single()
    userData = inserted
  }

  const profile = userData as User | null

  // Fetch scan history (most recent first, max 20)
  const { data: scans } = await supabase
    .from('scans')
    .select('id, scan_type, status, credits_used, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20) as { data: Pick<Scan, 'id' | 'scan_type' | 'status' | 'credits_used' | 'created_at'>[] | null }

  const planColor =
    profile?.plan === 'elite' ? '#f59e0b' :
    profile?.plan === 'pro'   ? '#a882ff' :
                                '#9494b8'

  return (
    <div
      className="min-h-screen bg-[#0d0d14] text-[#f0f0ff]"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 h-[54px] flex items-center justify-between px-5 border-b border-white/[0.08]"
        style={{ background: 'rgba(13,13,20,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <span className="text-[1.1rem] font-extrabold tracking-tight">
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
        </span>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="text-[.76rem] text-[#9494b8] hover:text-white transition-colors"
          >
            Sign out
          </button>
        </form>
      </nav>

      <div className="max-w-[900px] mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[.9rem]"
              style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
            >
              {(profile?.email ?? user.email ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="text-[1.1rem] font-extrabold tracking-tight">Hi 👋</div>
              <div className="text-[.76rem] text-[#9494b8]">{profile?.email ?? user.email}</div>
            </div>
          </div>
          <div
            className="flex items-center gap-2 bg-white/[0.08] border border-white/[0.14] rounded-[10px] px-3 py-1.5 text-[.74rem] font-bold"
          >
            <span
              style={{
                background: 'linear-gradient(135deg,#a882ff,#6eb3ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '.98rem',
              }}
            >
              {profile?.credits ?? 0}
            </span>{' '}
            credits
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { label: 'Credits', value: String(profile?.credits ?? 0), color: '#a882ff' },
            { label: 'Plan', value: profile?.plan ?? 'basic', color: planColor },
            { label: 'Scans', value: String(scans?.length ?? 0), color: '#f0f0ff' },
          ].map(s => (
            <div
              key={s.label}
              className="bg-[#1c1c2e] border border-white/[0.08] rounded-[18px] p-4 text-center shadow-lg"
            >
              <div className="text-[.6rem] text-[#9494b8] uppercase tracking-wider mb-1.5">
                {s.label}
              </div>
              <div
                className="text-[1.65rem] font-extrabold capitalize"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* No credits prompt */}
        {(profile?.credits ?? 0) === 0 && (
          <div
            className="mb-5 rounded-[20px] p-5 flex items-center justify-between gap-4 flex-wrap"
            style={{
              background: 'rgba(168,130,255,0.05)',
              border: '1px solid rgba(168,130,255,0.2)',
            }}
          >
            <div>
              <p className="font-bold mb-1">No credits yet</p>
              <p className="text-[.8rem] text-[#9494b8]">
                Purchase a plan to run your first AI scan.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 text-white text-[.8rem] font-bold px-5 py-2.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
            >
              ⚡ Buy credits
            </Link>
          </div>
        )}

        {/* New scan CTA */}
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 w-full text-white text-[.86rem] font-bold py-3.5 rounded-xl mb-6"
          style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
        >
          📷 New scan
        </Link>

        {/* Scan history */}
        <div className="text-[.7rem] font-bold text-[#9494b8] uppercase tracking-wider mb-3">
          Scan History
        </div>

        {!scans?.length ? (
          <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-10 text-center text-[#55556e]">
            <div className="text-3xl mb-3 opacity-40">📷</div>
            <p className="text-[.8rem] mb-3">No scans yet</p>
            <Link
              href="/upload"
              className="text-[.76rem] hover:underline"
              style={{ color: '#a882ff' }}
            >
              Run your first scan →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {scans.map(scan => (
              <Link
                key={scan.id}
                href={scan.status === 'complete' ? `/results/${scan.id}` : '#'}
                className={`flex items-center justify-between px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-[14px] transition-colors ${
                  scan.status === 'complete'
                    ? 'hover:bg-white/[0.08] cursor-pointer'
                    : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      scan.status === 'complete'
                        ? 'bg-[#a882ff]'
                        : scan.status === 'failed'
                        ? 'bg-red-400'
                        : scan.status === 'processing'
                        ? 'bg-yellow-400'
                        : 'bg-[#55556e]'
                    }`}
                  />
                  <div>
                    <div className="text-[.82rem] font-semibold">
                      {scan.scan_type === 'comparison'
                        ? 'Goal comparison scan'
                        : 'Physique scan'}
                    </div>
                    <div className="text-[.69rem] text-[#9494b8] mt-0.5">
                      {formatDate(scan.created_at)}
                      {scan.status === 'failed' && (
                        <span className="text-red-400 ml-2">· failed</span>
                      )}
                      {scan.status === 'processing' && (
                        <span className="text-yellow-400 ml-2">· processing…</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[.69rem] text-[#55556e]">
                    {scan.credits_used} cr
                  </span>
                  {scan.status === 'complete' && (
                    <span className="text-[#55556e] text-sm">›</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
