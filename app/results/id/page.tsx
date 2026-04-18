import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AnalysisResult } from '@/types'

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth?redirectTo=/results/' + params.id)

  // Validate UUID format to prevent injection
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(params.id)) notFound()

  const { data: scan, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id) // RLS + explicit filter — user can only see their own scans
    .single()

  if (error || !scan) notFound()

  if (scan.status === 'failed') {
    return (
      <div
        className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-4"
        style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
      >
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-4">❌</div>
          <p className="text-[#f0f0ff] font-bold mb-2">Analysis failed</p>
          <p className="text-[#9494b8] text-sm mb-6">
            Something went wrong with the AI analysis. Your credits were not deducted.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
          >
            Try again
          </Link>
        </div>
      </div>
    )
  }

  if (scan.status === 'processing') {
    return (
      <div
        className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-4"
        style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/10 border-t-[#a882ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9494b8]">Your analysis is still processing…</p>
          <p className="text-[#55556e] text-sm mt-1">This usually takes 20–40 seconds</p>
        </div>
      </div>
    )
  }

  if (scan.status !== 'complete' || !scan.result) {
    redirect('/dashboard')
  }

  const r = scan.result as AnalysisResult

  // Validate result shape before rendering to avoid runtime crashes
  if (!r.summary || !r.muscle_analysis || !r.workout_plan || !r.diet_plan) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Result data is incomplete. Please contact support.</p>
          <Link href="/dashboard" className="text-[#a882ff] hover:underline">← Dashboard</Link>
        </div>
      </div>
    )
  }

  const tag = (color: string, icon: string, label: string) => (
    <p
      className="text-[.63rem] font-bold tracking-[.1em] uppercase flex items-center gap-1.5 mb-3"
      style={{ color }}
    >
      {icon} {label}
    </p>
  )

  return (
    <div
      className="min-h-screen bg-[#0d0d14] text-[#f0f0ff]"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
    >
      {/* Sticky sub-nav */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-2.5 border-b border-white/[0.08]"
        style={{ background: 'rgba(13,13,20,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-[.77rem] font-semibold text-[#9494b8] bg-white/[0.08] border border-white/[0.08] px-3.5 py-1.5 rounded-[10px] hover:text-white transition-colors"
        >
          ← Dashboard
        </Link>
        <Link
          href="/upload"
          className="text-white text-[.74rem] font-bold px-3.5 py-1.5 rounded-[10px]"
          style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
        >
          📷 New scan
        </Link>
      </div>

      <div className="max-w-[540px] mx-auto px-5 py-5 pb-12 space-y-3">

        {/* Summary */}
        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5 shadow-lg">
          {tag('#a882ff', '🧠', 'AI Summary')}
          <p className="text-[.83rem] text-[#9494b8] leading-relaxed mb-3">{r.summary}</p>
          <span
            className="inline-flex items-center gap-1.5 text-[.71rem] px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              color: '#f59e0b',
            }}
          >
            ⚠️ {r.body_fat_estimate}
          </span>
        </div>

        {/* Priority Focus */}
        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5 shadow-lg">
          {tag('#6eb3ff', '🎯', 'Priority Focus Areas')}
          <div className="space-y-2">
            {r.priority_focus.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/[0.08]"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <span
                  className="text-[.68rem] font-bold font-mono w-[18px] flex-shrink-0 mt-0.5"
                  style={{ color: '#a882ff' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[.8rem] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Muscle Analysis */}
        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5 shadow-lg">
          {tag('#a882ff', '📊', 'Muscle Group Analysis')}
          {Object.entries(r.muscle_analysis)
            .filter(([k]) => k !== 'overall_impression')
            .map(([muscle, text]) => (
              <div key={muscle} className="border-b border-white/[0.08] py-3 last:border-0">
                <p className="text-[.64rem] text-[#55556e] uppercase tracking-wider mb-1 capitalize">
                  {muscle.replace('_', ' ')}
                </p>
                <p className="text-[.79rem] text-[#9494b8] leading-relaxed">{text as string}</p>
              </div>
            ))}
          {r.muscle_analysis.overall_impression && (
            <div className="mt-2.5 bg-white/[0.05] rounded-xl p-3">
              <p className="text-[.63rem] text-[#55556e] mb-1">Overall</p>
              <p className="text-[.79rem] text-[#9494b8]">{r.muscle_analysis.overall_impression}</p>
            </div>
          )}
        </div>

        {/* Workout Plan */}
        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5 shadow-lg">
          {tag('#6eb3ff', '🏋️', 'Your Workout Plan')}
          <div className="space-y-2">
            {r.workout_plan.map(day => (
              <div
                key={day.day}
                className="bg-white/[0.05] border border-white/[0.08] rounded-[14px] p-3.5"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[.83rem] font-bold">{day.day}</span>
                  <span
                    className="text-[.62rem] font-bold text-white px-2 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
                  >
                    {day.focus}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {day.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-2 py-1.5 border-b border-white/[0.06] last:border-0"
                    >
                      <div>
                        <p className="text-[.77rem]">{ex.name}</p>
                        {ex.notes && (
                          <p className="text-[.65rem] text-[#55556e] mt-0.5">{ex.notes}</p>
                        )}
                      </div>
                      <span className="text-[.69rem] font-mono text-[#9494b8] flex-shrink-0">
                        {ex.sets}×{ex.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diet Blueprint */}
        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5 shadow-lg">
          {tag('#ff85c8', '🥗', 'Diet Blueprint')}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { l: 'Calories', v: r.diet_plan.calories_estimate },
              { l: 'Protein', v: r.diet_plan.protein_target },
              { l: 'Carbs', v: r.diet_plan.carbs_target },
              { l: 'Fats', v: r.diet_plan.fats_target },
            ].map(m => (
              <div
                key={m.l}
                className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-2.5 text-center"
              >
                <p className="text-[.6rem] text-[#9494b8] uppercase tracking-wider mb-1">{m.l}</p>
                <p
                  className="text-[.68rem] font-bold leading-tight"
                  style={{
                    background: 'linear-gradient(135deg,#a882ff,#6eb3ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {m.v}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[.73rem] text-[#9494b8] mb-3">{r.diet_plan.meal_timing}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className="text-[.63rem] font-bold uppercase tracking-wider mb-2"
                style={{ color: '#a882ff' }}
              >
                ✦ Prioritize
              </p>
              {r.diet_plan.foods_to_prioritize.map((f, i) => (
                <p
                  key={i}
                  className="flex items-start gap-1.5 text-[.77rem] text-[#9494b8] mb-1.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: '#a882ff' }}
                  />
                  {f}
                </p>
              ))}
            </div>
            <div>
              <p className="text-[.63rem] font-bold uppercase tracking-wider mb-2 text-[#55556e]">
                ✦ Limit
              </p>
              {r.diet_plan.foods_to_limit.map((f, i) => (
                <p
                  key={i}
                  className="flex items-start gap-1.5 text-[.77rem] text-[#9494b8] mb-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#55556e]" />
                  {f}
                </p>
              ))}
            </div>
          </div>
          {r.diet_plan.supplements && r.diet_plan.supplements.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <p className="text-[.63rem] font-bold uppercase tracking-wider mb-2 text-[#9494b8]">
                Supplements
              </p>
              {r.diet_plan.supplements.map((s, i) => (
                <p key={i} className="text-[.77rem] text-[#9494b8] mb-1.5">
                  · {s}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Gap Analysis (comparison only) */}
        {r.gap_analysis && (
          <div
            className="rounded-[20px] p-5"
            style={{
              background: 'linear-gradient(145deg,rgba(168,130,255,.07),rgba(110,179,255,.05))',
              border: '1px solid rgba(168,130,255,.2)',
            }}
          >
            {tag('#a882ff', '📈', 'Gap Analysis')}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                { l: 'Current State', t: r.gap_analysis.current_state },
                { l: 'Goal State', t: r.gap_analysis.goal_state },
              ].map(s => (
                <div
                  key={s.l}
                  className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3"
                >
                  <p className="text-[.63rem] text-[#55556e] uppercase tracking-wider mb-1.5">
                    {s.l}
                  </p>
                  <p className="text-[.77rem] text-[#9494b8] leading-relaxed">{s.t}</p>
                </div>
              ))}
            </div>
            <p className="text-[.63rem] text-[#55556e] uppercase tracking-wider mb-2.5">
              Key Milestones
            </p>
            {r.gap_analysis.key_milestones.map((m, i) => (
              <div key={i} className="flex gap-2 mb-1.5 text-[.77rem] text-[#9494b8]">
                <span style={{ color: '#a882ff' }}>→</span>
                {m}
              </div>
            ))}
            <div
              className="mt-3 rounded-xl p-3"
              style={{
                background: 'linear-gradient(135deg,rgba(168,130,255,.1),rgba(110,179,255,.07))',
                border: '1px solid rgba(168,130,255,.2)',
              }}
            >
              <p className="text-[.63rem] font-bold mb-1" style={{ color: '#a882ff' }}>
                ⏱ Realistic Timeline
              </p>
              <p className="text-[.79rem] text-[#9494b8]">
                {r.gap_analysis.realistic_timeline}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5 shadow-lg">
          {tag('#a882ff', '⏱', 'Timeline')}
          <p className="text-[.83rem] text-[#9494b8]">{r.timeline}</p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-[14px] p-4 flex gap-2.5 text-[.72rem] text-[#9494b8] leading-relaxed"
          style={{
            background: 'rgba(245,158,11,0.07)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <span>⚠️</span>
          <p>{r.disclaimer}</p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
          >
            📷 Run another scan
          </Link>
        </div>
      </div>
    </div>
  )
}
