import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-5 text-[#f0f0ff]"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}
    >
      <div className="text-center max-w-sm">
        <div className="text-[1.4rem] font-extrabold tracking-tight mb-6">
          Physi<span style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Q</span>
        </div>
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-extrabold mb-2">Page not found</h1>
        <p className="text-[#9494b8] text-sm mb-8 leading-relaxed">
          If you clicked a confirmation link from your email, it may have expired. Sign in or request a new link.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/auth"
            className="w-full text-white font-bold py-3 rounded-xl text-sm text-center"
            style={{ background: 'linear-gradient(135deg,#a882ff,#6eb3ff)' }}
          >
            Go to Sign in
          </Link>
          <Link
            href="/"
            className="w-full font-bold py-3 rounded-xl text-sm text-center bg-white/[0.08] border border-white/[0.14] text-[#f0f0ff]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
        }
