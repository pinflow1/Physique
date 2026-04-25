import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AnalysisResult } from '@/types'

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth?redirectTo=/results/' + params.id)

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(params.id)) notFound()

  const { data: scan, error } = await supabase
    .from('scans').select('*').eq('id', params.id).eq('user_id', user.id).single()

  if (error || !scan) notFound()

  if (scan.status === 'failed') return (
    <Wrap><div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>❌</div>
      <p style={{ fontWeight: 600, marginBottom: '8px' }}>Analysis failed</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '24px' }}>Your credits were not deducted.</p>
      <Link href="/upload" className="btn-gloss btn-primary" style={{ textDecoration: 'none' }}>Try again</Link>
    </div></Wrap>
  )

  if (scan.status === 'processing') return (
    <Wrap><div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: '40px', height: '40px', border: '2px solid var(--border-2)', borderTopColor: 'var(--text)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.6s linear infinite' }} />
      <p style={{ color: 'var(--text-3)', fontSize: '0.87rem' }}>Analysis in progress…</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginTop: '6px' }}>Usually takes 20–40 seconds</p>
    </div></Wrap>
  )

  if (scan.status !== 'complete' || !scan.result) redirect('/dashboard')

  const r = scan.result as AnalysisResult
  if (!r.summary || !r.muscle_analysis || !r.workout_plan || !r.diet_plan) redirect('/dashboard')

  return (
    <Wrap>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Summary */}
        <Block label="🧠 AI Summary">
          <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '12px' }}>{r.summary}</p>
          <Tag>⚠️ {r.body_fat_estimate}</Tag>
        </Block>

        {/* Priority */}
        <Block label="🎯 Priority Focus Areas">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {r.priority_focus.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'DM Mono,monospace', color: 'var(--text-3)', width: '18px', flexShrink: 0, marginTop: '2px' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </Block>

        {/* Muscle Analysis */}
        <Block label="📊 Muscle Group Analysis">
          {Object.entries(r.muscle_analysis).filter(([k]) => k !== 'overall_impression').map(([muscle, text]) => (
            <div key={muscle} style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
              <p style={{ fontSize: '0.62rem', color: 'var(--text-4)', textTransform: 'capitalize' as any, letterSpacing: '0.07em', marginBottom: '3px' }}>{muscle.replace('_', ' ')}</p>
              <p style={{ fontSize: '0.79rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{text as string}</p>
            </div>
          ))}
          {r.muscle_analysis.overall_impression && (
            <div style={{ marginTop: '10px', background: 'var(--card-3)', borderRadius: '10px', padding: '10px 12px' }}>
              <p style={{ fontSize: '0.61rem', color: 'var(--text-4)', marginBottom: '3px' }}>Overall</p>
              <p style={{ fontSize: '0.79rem', color: 'var(--text-2)' }}>{r.muscle_analysis.overall_impression}</p>
            </div>
          )}
        </Block>

        {/* Workout Plan */}
        <Block label="🏋️ Your Workout Plan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {r.workout_plan.map(day => (
              <div key={day.day} style={{ background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{day.day}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, background: 'var(--accent)', color: 'var(--accent-fg)', padding: '3px 9px', borderRadius: '999px' }}>{day.focus}</span>
                </div>
                {day.exercises.map((ex, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', padding: '6px 0', borderBottom: i < day.exercises.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <p style={{ fontSize: '0.77rem' }}>{ex.name}</p>
                      {ex.notes && <p style={{ fontSize: '0.65rem', color: 'var(--text-4)', marginTop: '2px' }}>{ex.notes}</p>}
                    </div>
                    <span style={{ fontSize: '0.69rem', fontFamily: 'DM Mono,monospace', color: 'var(--text-3)', flexShrink: 0 }}>{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Block>

        {/* Diet */}
        <Block label="🥗 Diet Blueprint">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '16px' }}>
            {[
              { l: 'Calories', v: r.diet_plan.calories_estimate },
              { l: 'Protein', v: r.diet_plan.protein_target },
              { l: 'Carbs', v: r.diet_plan.carbs_target },
              { l: 'Fats', v: r.diet_plan.fats_target },
            ].map(m => (
              <div key={m.l} style={{ background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.58rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{m.l}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text)' }}>{m.v}</p>
              </div>
            ))}
          </div>
          {r.diet_plan.meal_timing && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '14px' }}>{r.diet_plan.meal_timing}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-2)', marginBottom: '8px' }}>✦ Prioritize</p>
              {r.diet_plan.foods_to_prioritize.map((f, i) => (
                <p key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.77rem', color: 'var(--text-3)', marginBottom: '6px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text)', flexShrink: 0, marginTop: '5px' }} />{f}
                </p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-4)', marginBottom: '8px' }}>✦ Limit</p>
              {r.diet_plan.foods_to_limit.map((f, i) => (
                <p key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.77rem', color: 'var(--text-3)', marginBottom: '6px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-4)', flexShrink: 0, marginTop: '5px' }} />{f}
                </p>
              ))}
            </div>
          </div>
        </Block>

        {/* Gap Analysis */}
        {r.gap_analysis && (
          <Block label="📈 Gap Analysis">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              {[{ l: 'Current State', t: r.gap_analysis.current_state }, { l: 'Goal State', t: r.gap_analysis.goal_state }].map(s => (
                <div key={s.l} style={{ background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                  <p style={{ fontSize: '0.61rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{s.l}</p>
                  <p style={{ fontSize: '0.77rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{s.t}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.61rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Key Milestones</p>
            {r.gap_analysis.key_milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.77rem', color: 'var(--text-3)', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text)' }}>→</span>{m}
              </div>
            ))}
            <div style={{ marginTop: '12px', background: 'var(--card-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
              <p style={{ fontSize: '0.61rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-2)' }}>⏱ Realistic Timeline</p>
              <p style={{ fontSize: '0.79rem', color: 'var(--text-3)' }}>{r.gap_analysis.realistic_timeline}</p>
            </div>
          </Block>
        )}

        {/* Timeline */}
        <Block label="⏱ Timeline">
          <p style={{ fontSize: '0.83rem', color: 'var(--text-2)' }}>{r.timeline}</p>
        </Block>

        {/* Disclaimer */}
        <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px', fontSize: '0.73rem', color: 'var(--text-3)', lineHeight: 1.55 }}>
          <span>⚠️</span><p>{r.disclaimer}</p>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <Link href="/upload" className="btn-gloss btn-primary" style={{ textDecoration: 'none' }}>📷 Run another scan</Link>
        </div>
      </div>
    </Wrap>
  )
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <Link href="/dashboard" style={{ fontSize: '0.77rem', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', background: 'var(--card-3)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '10px' }}>← Dashboard</Link>
        <Link href="/upload" className="btn-gloss btn-primary" style={{ textDecoration: 'none', fontSize: '0.76rem', padding: '7px 14px', borderRadius: '10px' }}>📷 New scan</Link>
      </div>
      <div style={{ maxWidth: '540px', margin: '0 auto', padding: '16px 20px 48px' }}>{children}</div>
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '18px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
      <p style={{ fontSize: '0.61rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '12px' }}>{label}</p>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.71rem', padding: '5px 10px', borderRadius: '8px', background: 'var(--card-3)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
      {children}
    </span>
  )
                                                                          }
        
