import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  let { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
  if (!userData) {
    const { data: inserted } = await supabase
      .from('users').insert({ id: user.id, email: user.email ?? '', plan: 'basic', credits: 0 }).select().single()
    userData = inserted
  }

  const { data: scans } = await supabase
    .from('scans').select('id,scan_type,status,credits_used,created_at')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)

  const s = { fontFamily: "'DM Sans',system-ui,sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', ...s }}>

      {/* NAV */}
      <nav className="nav">
        <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PhysiQ</span>
        <Link href="/settings" style={{ fontSize: '0.76rem', color: 'var(--text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
          Settings ›
        </Link>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              {(userData?.email ?? user.email ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Hi 👋</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{userData?.email ?? user.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '7px 14px', fontSize: '0.76rem', fontWeight: 600 }}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>{userData?.credits ?? 0}</span> credits
          </div>
        </div>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Credits', value: String(userData?.credits ?? 0) },
            { label: 'Plan', value: userData?.plan ?? 'basic' },
            { label: 'Scans', value: String(scans?.length ?? 0) },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'capitalize' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* No credits */}
        {(userData?.credits ?? 0) === 0 && (
          <div style={{ marginBottom: '16px', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', background: 'var(--card-2)', border: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.87rem', marginBottom: '3px' }}>No credits yet</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Purchase a plan to run your first scan.</p>
            </div>
            <Link href="/pricing" className="btn-gloss btn-primary" style={{ textDecoration: 'none', fontSize: '0.79rem', padding: '9px 18px' }}>
              Buy credits
            </Link>
          </div>
        )}

        {/* New scan */}
        <Link href="/upload" className="btn-gloss btn-primary" style={{ textDecoration: 'none', width: '100%', borderRadius: '14px', padding: '14px', fontSize: '0.88rem', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          📷 New scan
        </Link>

        {/* Scan history */}
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Scan History
        </div>

        {!scans?.length ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.3 }}>📷</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '12px' }}>No scans yet</p>
            <Link href="/upload" style={{ fontSize: '0.78rem', color: 'var(--text-2)', textDecoration: 'underline' }}>Run your first scan →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(scans as any[]).map((scan: any) => (
              <Link key={scan.id} href={scan.status === 'complete' ? `/results/${scan.id}` : '#'}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', textDecoration: 'none', color: 'inherit', transition: 'background 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: scan.status === 'complete' ? 'var(--text)' : scan.status === 'failed' ? '#ef4444' : '#f59e0b' }} />
                  <div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>
                      {scan.scan_type === 'comparison' ? 'Goal comparison scan' : 'Physique scan'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '2px' }}>
                      {formatDate(scan.created_at)}
                      {scan.status === 'failed' && <span style={{ color: '#ef4444', marginLeft: '6px' }}>· failed</span>}
                      {scan.status === 'processing' && <span style={{ color: '#f59e0b', marginLeft: '6px' }}>· processing…</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>{scan.credits_used} cr</span>
                  {scan.status === 'complete' && <span style={{ color: 'var(--text-4)' }}>›</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
        }
            
