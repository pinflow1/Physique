'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [dark, setDark] = useState(true)
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', transition: 'background 0.2s, color 0.2s' }}>

      {/* NAV */}
      <nav className="nav">
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PhysiQ</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/pricing" style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-3)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none' }}>Pricing</Link>
          <button className="theme-toggle" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
          <Link href="/auth" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', padding: '7px 14px', borderRadius: '10px', border: '1px solid var(--border-2)', textDecoration: 'none', background: 'var(--card-3)' }}>Sign in</Link>
          <Link href="/auth?tab=signup" className="btn-gloss btn-primary" style={{ padding: '7px 16px', fontSize: '0.78rem', textDecoration: 'none' }}>Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 20px 64px', textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <div className="pill" style={{ marginBottom: '20px' }}>⚡ Powered by GPT-4o Vision</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,7vw,3.8rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '18px' }}>
          Your body.<br />
          <span style={{ color: 'var(--text-3)' }}>Analyzed.</span> Optimized.
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-3)', lineHeight: 1.65, marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          Upload one photo. Get a personalized workout plan, diet blueprint, and physique analysis built around your body — not a template.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
          <Link href="/auth?tab=signup" className="btn-gloss btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
            Start your analysis →
          </Link>
          <button className="btn-gloss" onClick={() => setShowDemo(d => !d)} style={{ fontSize: '0.9rem' }}>
            🎯 See example result
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>From $5.99 · No subscription · Pay per use</p>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--card-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '56px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>Everything your body needs</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '0.84rem' }}>One photo. Full analysis across training, nutrition, and physique gaps.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '10px' }}>
            {[
              { icon: '🧠', title: 'Physique Analysis', desc: 'AI assesses muscle development, body composition, and key imbalances.' },
              { icon: '⚡', title: 'Custom Workout Plan', desc: 'A full 6-day training split built around your specific weak points.' },
              { icon: '🥗', title: 'Diet Blueprint', desc: 'Calorie targets, macros, timing, and supplement guidance.' },
              { icon: '📊', title: 'Goal Comparison', desc: 'Upload a goal physique. Get gap analysis and a timeline. (Pro+)' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Images stored securely. Delete your data anytime.' },
              { icon: '💳', title: 'Pay Per Use', desc: 'No subscriptions. Buy credits once. They never expire.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{f.icon}</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>{f.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '56px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>How it works</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '0.84rem' }}>Three steps to a personalized plan.</p>
          </div>
          <div className="card-raised" style={{ padding: '4px 24px' }}>
            {[
              { n: '1', t: 'Upload your photo', d: 'Take a full-body photo in good lighting. Optionally add a goal physique for comparison.' },
              { n: '2', t: 'AI analyzes in 30 seconds', d: 'GPT-4o Vision assesses muscle groups, body composition, imbalances, and strengths.' },
              { n: '3', t: 'Get your full plan', d: 'Receive a custom workout split, diet blueprint with macros, and transformation timeline.' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: '16px', padding: '22px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent)', color: 'var(--accent-fg)', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>{s.t}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.55 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO RESULT */}
      {showDemo && (
        <section style={{ background: 'var(--card-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 20px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div className="pill">DEMO — Example Output</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>No real photo used</span>
            </div>
            <DemoPreview />
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link href="/auth?tab=signup" className="btn-gloss btn-primary" style={{ textDecoration: 'none' }}>Get your real analysis →</Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section style={{ padding: '56px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '24px' }}>What people are saying</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '12px' }}>
            {[
              { q: '"The gap analysis was brutally honest. My lower body was way behind and the plan fixed it. 3 months in, my legs have caught up."', n: 'Marcus T.', p: 'Pro plan · 3 months' },
              { q: '"Finally stopped guessing. The macro targets were spot on and the workout plan was tailored to my weak points, not a generic template."', n: 'Jordan K.', p: 'Basic plan · 6 weeks' },
              { q: '"Uploaded my photo and a goal physique. The 14-month timeline was brutally honest but realistic. I\'m on track."', n: 'Aisha M.', p: 'Elite plan · 5 months' },
            ].map(t => (
              <div key={t.n} className="card" style={{ padding: '20px' }}>
                <div style={{ color: 'var(--text-3)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '12px' }}>{t.q}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.n}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-4)' }}>{t.p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--card-2)', borderTop: '1px solid var(--border)', padding: '64px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px' }}>Ready to see your analysis?</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.87rem', marginBottom: '24px' }}>Upload and get a complete personalized plan in under 60 seconds.</p>
        <Link href="/auth?tab=signup" className="btn-gloss btn-primary" style={{ textDecoration: 'none', fontSize: '0.92rem' }}>Get started →</Link>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-4)', marginTop: '12px' }}>Not medical advice · Visual estimates only · Credits never expire</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em' }}>PhysiQ</span>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'var(--text-4)' }}>
            <Link href="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/auth" style={{ color: 'inherit', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DemoPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="card" style={{ padding: '18px' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '10px' }}>🧠 AI Summary</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '10px' }}>Mesomorphic build with solid upper body development. Lower body and posterior chain are the primary growth opportunities.</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.71rem', padding: '5px 10px', borderRadius: '8px', background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>⚠️ Est. 18–22% body fat (visual estimate only)</span>
      </div>
      <div className="card" style={{ padding: '18px' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '10px' }}>🎯 Priority Focus</p>
        {['Bring up lower body to match upper body', 'Address posterior chain — back, rear delts', 'Reduce body fat 4–6% to reveal existing muscle'].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'DM Mono', color: 'var(--text-3)', width: '18px', flexShrink: 0, marginTop: '2px' }}>0{i + 1}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{t}</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '18px' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '10px' }}>🥗 Diet Blueprint</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
          {[{ l: 'Calories', v: '2,800–3,100' }, { l: 'Protein', v: '175–190g' }, { l: 'Carbs', v: '300–350g' }, { l: 'Fats', v: '70–85g' }].map(m => (
            <div key={m.l} style={{ background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{m.l}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text)' }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
                                     }
                             
