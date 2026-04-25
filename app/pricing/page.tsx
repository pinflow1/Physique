import Link from 'next/link'

const plans = [
  { id:'basic', name:'Basic', price:'$5.99', credits:15, desc:'Perfect for getting started', features:['15 scan credits','Full physique analysis','Custom workout plan','Diet blueprint'], locked:['Goal comparison'], badge:null, highlight:false },
  { id:'pro', name:'Pro', price:'$9.99', credits:50, desc:'Most popular choice', features:['50 scan credits','Full physique analysis','Custom workout plan','Diet blueprint','Goal comparison scan','Gap analysis + timeline'], locked:[], badge:'Most Popular', highlight:true },
  { id:'elite', name:'Elite', price:'$19.99', credits:150, desc:'Maximum value', features:['150 scan credits','Everything in Pro','Priority processing'], locked:[], badge:'Best Value', highlight:false },
]

export default function PricingPage() {
  const s = { fontFamily: "'DM Sans',system-ui,sans-serif" }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', ...s }}>
      <nav className="nav">
        <Link href="/" style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', textDecoration: 'none', color: 'var(--text)' }}>PhysiQ</Link>
        <Link href="/auth?tab=signup" className="btn-gloss btn-primary" style={{ textDecoration: 'none', padding: '7px 16px', fontSize: '0.78rem' }}>Get started</Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 48px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', background: 'var(--card-3)', border: '1px solid var(--border)', padding: '7px 14px', borderRadius: '10px', marginBottom: '32px' }}>← Back</Link>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="pill" style={{ marginBottom: '14px' }}>⚡ No subscription. Pay per use.</div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '8px' }}>Simple pricing</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.84rem' }}>Credits never expire. Buy once, use when you need them.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '12px' }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ position: 'relative', borderRadius: '20px', padding: '24px', border: plan.highlight ? '1.5px solid var(--bg-600)' : '1px solid var(--border)', background: plan.highlight ? 'var(--card-2)' : 'var(--card)', boxShadow: plan.highlight ? 'var(--shadow-lg)' : 'var(--shadow-sm)', transition: 'transform 0.15s', cursor: 'default' }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.62rem', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: 'var(--accent)', color: 'var(--accent-fg)', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                  {plan.badge.toUpperCase()}
                </div>
              )}
              <p style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '3px' }}>{plan.name}</p>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-3)', marginBottom: '14px' }}>{plan.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '3px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em' }}>{plan.price}</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-3)' }}>per use</span>
              </div>
              <p style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '18px' }}>{plan.credits} credits included</p>
              <Link href="/auth?tab=signup"
                className={plan.highlight ? 'btn-gloss btn-primary' : 'btn-gloss'}
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center', width: '100%', borderRadius: '12px', padding: '10px', fontSize: '0.82rem', marginBottom: '18px' }}>
                Get {plan.name}
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--text)', flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
                {plan.locked.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', opacity: 0.4 }}>
                    <span style={{ color: 'var(--text-4)', flexShrink: 0 }}>✕</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-4)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.73rem', color: 'var(--text-4)', marginTop: '20px' }}>
          1 credit = 1 scan · 4 credits = goal comparison · Not medical advice
        </p>
      </div>
    </div>
  )
                                       }
                    
