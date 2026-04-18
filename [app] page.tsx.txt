'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-[#0d0d14] text-[#f0f0ff]" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[54px] flex items-center justify-between px-5 border-b border-white/[0.08]" style={{background:'rgba(13,13,20,0.88)',backdropFilter:'blur(20px)'}}>
        <span className="text-[1.15rem] font-extrabold tracking-tight">
          Physi<span style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Q</span>
        </span>
        <div className="flex items-center gap-2">
          <Link href="/pricing" className="text-[#9494b8] text-[.78rem] font-medium px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.08] transition-all">Pricing</Link>
          <Link href="/auth" className="text-[#9494b8] text-[.78rem] font-medium px-3 py-1.5 rounded-lg border border-white/[0.14] hover:text-white transition-all">Sign in</Link>
          <Link href="/auth?tab=signup" className="text-[.78rem] font-bold px-4 py-1.5 rounded-[10px] text-white" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-[90px] pb-16 px-5 text-center relative overflow-hidden">
        <div className="absolute top-0 right-[-80px] w-[500px] h-[500px] rounded-full opacity-50 pointer-events-none" style={{background:'rgba(160,130,255,0.15)',filter:'blur(80px)'}} />
        <div className="absolute bottom-[100px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-50 pointer-events-none" style={{background:'rgba(120,180,255,0.12)',filter:'blur(80px)'}} />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.14] rounded-full px-3.5 py-1.5 text-[.72rem] font-semibold mb-5" style={{color:'#a882ff'}}>
            ⚡ Powered by GPT-4o Vision
          </div>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold tracking-tight leading-[1.07] mb-4">
            Your body.<br />
            <span style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Analyzed.</span> Optimized.
          </h1>
          <p className="text-[#9494b8] text-[.93rem] max-w-[420px] mx-auto mb-7 leading-relaxed">
            Upload one photo. Get a personalized workout plan, diet blueprint, and physique analysis built around your body — not a template.
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center mb-2.5">
            <Link href="/auth?tab=signup" className="inline-flex items-center gap-2 text-white text-[.9rem] font-bold px-7 py-3.5 rounded-xl" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>
              Start your analysis →
            </Link>
            <button onClick={() => { setShowDemo(true); setTimeout(() => document.getElementById('demo')?.scrollIntoView({behavior:'smooth'}), 100) }}
              className="inline-flex items-center gap-2 text-[.9rem] font-semibold px-6 py-3.5 rounded-xl border border-white/[0.14] bg-white/[0.08] hover:bg-white/[0.13] transition-all text-white">
              🎯 See example result
            </button>
          </div>
          <p className="text-[.7rem] text-[#55556e]">From $5.99 · No subscription · Credits never expire</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#13131e] border-y border-white/[0.08] py-12 px-5">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[1.45rem] font-extrabold tracking-tight mb-2">Everything your body needs</h2>
            <p className="text-[#9494b8] text-[.83rem]">One photo. Full analysis across training, nutrition, and physique gaps.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              {icon:'🧠', title:'Physique Analysis', desc:'AI assesses muscle development, visual body composition, and key imbalances.'},
              {icon:'⚡', title:'Custom Workout Plan', desc:'A full 6-day training split built around your specific weak points.'},
              {icon:'🥗', title:'Diet Blueprint', desc:'Calorie targets, macros, food timing, and evidence-based supplement guidance.'},
              {icon:'📊', title:'Goal Comparison', desc:'Upload a goal physique. Get a gap analysis and realistic timeline. (Pro+)'},
              {icon:'🔒', title:'Secure & Private', desc:'Images stored securely. Delete your data anytime. Never sold or shared.'},
              {icon:'💳', title:'Pay Once', desc:'No subscriptions. Buy credits once and use them whenever you want.'},
            ].map(f => (
              <div key={f.title} className="bg-[#1c1c2e] border border-white/[0.08] rounded-[18px] p-[18px] hover:-translate-y-1 transition-transform">
                <div className="text-[1.4rem] mb-2.5">{f.icon}</div>
                <div className="text-[.85rem] font-bold mb-1.5">{f.title}</div>
                <div className="text-[.75rem] text-[#9494b8] leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 px-5">
        <div className="max-w-[540px] mx-auto">
          <div className="text-center mb-7">
            <h2 className="text-[1.45rem] font-extrabold tracking-tight mb-2">How it works</h2>
            <p className="text-[#9494b8] text-[.83rem]">Three steps to a fully personalized fitness plan.</p>
          </div>
          <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] px-5 py-1 shadow-xl">
            {[
              {n:'1', title:'Upload your photo', desc:'Take a full-body photo in good lighting. Optionally add a goal physique for comparison.'},
              {n:'2', title:'AI analyzes in 30 seconds', desc:'GPT-4o Vision assesses muscle groups, body composition, imbalances, and strengths.'},
              {n:'3', title:'Get your full plan', desc:'Receive a custom 6-day workout split, diet blueprint with macros, and a transformation timeline.'},
            ].map((s, i) => (
              <div key={s.n} className={`flex gap-4 py-5 ${i < 2 ? 'border-b border-white/[0.08]' : ''}`}>
                <div className="w-9 h-9 rounded-xl text-white text-[.8rem] font-extrabold flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>{s.n}</div>
                <div>
                  <div className="text-[.9rem] font-bold mb-1">{s.title}</div>
                  <div className="text-[.78rem] text-[#9494b8] leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pb-12 px-5">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[1.45rem] font-extrabold tracking-tight text-center mb-6">What people are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {stars:'★★★★★', quote:'"The gap analysis was brutally honest. Told me my lower body was way behind and gave me a plan to fix it. 3 months in and my legs have caught up significantly."', name:'Marcus T.', plan:'Pro plan · 3 months'},
              {stars:'★★★★★', quote:'"Finally stopped guessing. The macro targets were spot on and the workout plan was actually tailored to my weak points — not just a generic push/pull/legs."', name:'Jordan K.', plan:'Basic plan · 6 weeks'},
              {stars:'★★★★★', quote:'"I uploaded my photo and a goal physique. The timeline it gave me — 14 months — was brutally honest but totally realistic. I\'m on track."', name:'Aisha M.', plan:'Elite plan · 5 months'},
            ].map(t => (
              <div key={t.name} className="bg-[#1c1c2e] border border-white/[0.08] rounded-[18px] p-5">
                <div className="text-[#f59e0b] text-[.8rem] mb-2">{t.stars}</div>
                <div className="text-[.82rem] text-[#9494b8] leading-relaxed mb-3">{t.quote}</div>
                <div className="text-[.72rem] font-bold">{t.name}</div>
                <div className="text-[.65rem] text-[#55556e]">{t.plan}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO RESULT PREVIEW */}
      {showDemo && (
        <section id="demo" className="border-y border-white/[0.08] py-12 px-5" style={{background:'rgba(168,130,255,0.04)'}}>
          <div className="max-w-[540px] mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[.62rem] font-bold bg-white/[0.08] border border-white/[0.14] px-3 py-1 rounded-full" style={{color:'#a882ff'}}>DEMO — Example Output</span>
              <span className="text-[.72rem] text-[#55556e]">Pre-generated. No real photo used.</span>
            </div>
            <DemoPreview />
            <div className="text-center mt-8">
              <Link href="/auth?tab=signup" className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>
                Get your real analysis →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-5 text-center" style={{background:'linear-gradient(145deg,rgba(168,130,255,0.08),rgba(110,179,255,0.06))'}}>
        <h2 className="text-[1.45rem] font-extrabold tracking-tight mb-2.5">Ready to see your analysis?</h2>
        <p className="text-[#9494b8] text-[.87rem] mb-6">Upload and get a complete personalized plan in under 60 seconds.</p>
        <Link href="/auth?tab=signup" className="inline-block text-white font-extrabold px-9 py-3.5 rounded-xl" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>
          Start for $5.99 ›
        </Link>
        <p className="text-[.67rem] text-[#55556e] mt-3">Not medical advice · Visual estimates only · Credits never expire</p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] py-6 px-5">
        <div className="max-w-[900px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <span className="text-[1rem] font-extrabold tracking-tight">
            Physi<span style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Q</span>
          </span>
          <div className="flex gap-5 text-[.75rem] text-[#55556e]">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/auth" className="hover:text-white transition-colors">Sign in</Link>
            <span>Not medical advice</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DemoPreview() {
  return (
    <div className="space-y-3">
      <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5">
        <p className="text-[.63rem] font-bold tracking-[.1em] uppercase mb-3" style={{color:'#a882ff'}}>🧠 AI Summary</p>
        <p className="text-[.83rem] text-[#9494b8] leading-relaxed mb-3">Mesomorphic build with solid upper body development. Lower body and posterior chain are the primary growth opportunities.</p>
        <span className="inline-flex items-center gap-1.5 text-[.71rem] px-3 py-1.5 rounded-lg" style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',color:'#f59e0b'}}>⚠️ Estimated 18–22% body fat (visual estimate only)</span>
      </div>
      <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5">
        <p className="text-[.63rem] font-bold tracking-[.1em] uppercase mb-3" style={{color:'#6eb3ff'}}>🎯 Priority Focus</p>
        {['Bring up lower body to match upper body','Address posterior chain — back, rear delts, hamstrings','Reduce body fat 4–6% to reveal existing muscle'].map((t,i) => (
          <div key={i} className="flex gap-2.5 mb-2 items-start">
            <span className="text-[.68rem] font-bold font-mono w-5 flex-shrink-0 mt-0.5" style={{color:'#a882ff'}}>0{i+1}</span>
            <span className="text-[.8rem]">{t}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#1c1c2e] border border-white/[0.08] rounded-[20px] p-5">
        <p className="text-[.63rem] font-bold tracking-[.1em] uppercase mb-3" style={{color:'#ff85c8'}}>🥗 Diet Blueprint</p>
        <div className="grid grid-cols-4 gap-2">
          {[{l:'Calories',v:'2,800–3,100'},{l:'Protein',v:'175–190g'},{l:'Carbs',v:'300–350g'},{l:'Fats',v:'70–85g'}].map(m => (
            <div key={m.l} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-2 text-center">
              <div className="text-[.6rem] text-[#9494b8] uppercase tracking-wider mb-1">{m.l}</div>
              <div className="text-[.72rem] font-bold" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
