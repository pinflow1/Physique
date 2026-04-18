import Link from 'next/link'

const plans = [
  { id:'basic', name:'Basic', price:'$5.99', credits:15, features:['15 scan credits','Full physique analysis','Custom workout plan','Diet blueprint'], locked:['Goal comparison'], badge:null, highlight:false },
  { id:'pro', name:'Pro', price:'$9.99', credits:50, features:['50 scan credits','Full physique analysis','Custom workout plan','Diet blueprint','Goal comparison scan','Gap analysis + timeline'], locked:[], badge:'Most Popular', highlight:true },
  { id:'elite', name:'Elite', price:'$19.99', credits:150, features:['150 scan credits','Everything in Pro','Priority processing'], locked:[], badge:'Best Value', highlight:false },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d14] text-[#f0f0ff]" style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <nav className="sticky top-0 z-50 h-[54px] flex items-center justify-between px-5 border-b border-white/[0.08]" style={{background:'rgba(13,13,20,0.9)',backdropFilter:'blur(20px)'}}>
        <Link href="/" className="text-[1.1rem] font-extrabold tracking-tight">
          Physi<span style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Q</span>
        </Link>
        <Link href="/auth" className="text-[.78rem] font-bold text-white px-4 py-1.5 rounded-lg" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)'}}>Get started</Link>
      </nav>

      <div className="max-w-[900px] mx-auto px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.08] rounded-[10px] px-3.5 py-1.5 text-[.77rem] font-semibold text-[#9494b8] hover:text-white transition-colors mb-8">← Back</Link>

        <div className="text-center mb-9">
          <div className="inline-flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.14] rounded-full px-3.5 py-1.5 text-[.72rem] font-semibold mb-4" style={{color:'#a882ff'}}>⚡ No subscription. Pay once.</div>
          <h1 className="text-[1.85rem] font-extrabold tracking-tight mb-2">Simple pricing</h1>
          <p className="text-[#9494b8] text-[.84rem]">Credits never expire. Buy once, use when you need them.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.map(plan => (
            <div key={plan.id} className={`relative rounded-[22px] p-6 border transition-all hover:-translate-y-1 ${plan.highlight ? 'border-[rgba(168,130,255,0.35)]' : 'border-white/[0.08] bg-[#1c1c2e]'}`}
              style={plan.highlight ? {background:'linear-gradient(160deg,rgba(168,130,255,.1),rgba(110,179,255,.06))',boxShadow:'0 0 40px rgba(168,130,255,.1)'} : {}}>
              {plan.badge && (
                <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 text-[.62rem] font-extrabold px-3 py-1 rounded-full whitespace-nowrap text-white" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',letterSpacing:'.04em'}}>
                  {plan.badge.toUpperCase()}
                </div>
              )}
              <p className="text-[.93rem] font-extrabold mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-[2rem] font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-[.74rem] text-[#9494b8]">one-time</span>
              </div>
              <p className="text-[.71rem] font-bold mb-4" style={{background:'linear-gradient(135deg,#a882ff,#6eb3ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{plan.credits} credits included</p>
              <Link href={`/auth?tab=signup&plan=${plan.id}`} className={`block w-full text-center font-bold py-2.5 rounded-xl text-[.79rem] mb-4 transition-all ${plan.highlight ? 'text-white hover:opacity-88' : 'bg-white/[0.08] text-[#f0f0ff] hover:bg-white/[0.13] border border-white/[0.14]'}`}
                style={plan.highlight ? {background:'linear-gradient(135deg,#a882ff,#6eb3ff)'} : {}}>
                Get {plan.name}
              </Link>
              <div className="space-y-1.5">
                {plan.features.map(f => <div key={f} className="flex items-start gap-2 text-[.76rem] text-[#9494b8]"><span style={{color:'#a882ff'}}>✓</span>{f}</div>)}
                {plan.locked.map(f => <div key={f} className="flex items-start gap-2 text-[.76rem] opacity-40"><span className="text-[#55556e]">✕</span><span className="line-through text-[#55556e]">{f}</span></div>)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[.72rem] text-[#55556e] mt-5">1 credit = 1 scan · 4 credits = goal comparison · Not medical advice</p>
      </div>
    </div>
  )
}
