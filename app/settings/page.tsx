import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
  const s = { fontFamily: "'DM Sans',system-ui,sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', ...s }}>
      <nav className="nav">
        <Link href="/dashboard" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>← Dashboard</Link>
        <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PhysiQ</span>
        <div style={{ width: '80px' }} />
      </nav>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px' }}>Settings</h1>

        {/* Account */}
        <Section title="Account">
          <Row label="Email" value={userData?.email ?? user.email ?? '—'} />
          <Row label="Plan" value={userData?.plan ?? 'basic'} capitalize />
          <Row label="Credits" value={String(userData?.credits ?? 0)} />
          {userData?.country && <Row label="Country" value={userData.country} />}
          {userData?.phone && <Row label="Phone" value={userData.phone} />}
          <Row label="Member since" value={new Date(user.created_at ?? '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
        </Section>

        {/* Credits */}
        <Section title="Credits">
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '3px' }}>{userData?.credits ?? 0} credits remaining</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>1 credit = 1 scan · 4 credits = goal comparison</p>
          </div>
          <Link href="/pricing" className="btn-gloss btn-primary" style={{ textDecoration: 'none', borderRadius: '12px', padding: '11px', fontSize: '0.82rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ⚡ Buy more credits
          </Link>
        </Section>

        {/* Legal */}
        <Section title="Legal">
          <Link href="/privacy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', textDecoration: 'none', color: 'var(--text)' }}>
            <span style={{ fontSize: '0.82rem' }}>Privacy Policy</span>
            <span style={{ color: 'var(--text-4)' }}>›</span>
          </Link>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-4)', marginTop: '12px', lineHeight: 1.55 }}>
            All analysis results are visual estimates only and do not constitute medical advice.
          </p>
        </Section>

        {/* Sign out */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-4)', marginBottom: '14px' }}>Account Actions</p>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="btn-gloss" style={{ width: '100%', borderRadius: '12px', padding: '11px', fontSize: '0.82rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', marginBottom: '10px' }}>
      <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-4)', marginBottom: '14px' }}>{title}</p>
      {children}
    </div>
  )
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '0.79rem', color: 'var(--text-3)' }}>{label}</span>
      <span style={{ fontSize: '0.79rem', fontWeight: 500, textTransform: capitalize ? 'capitalize' : 'none' as any }}>{value}</span>
    </div>
  )
}
