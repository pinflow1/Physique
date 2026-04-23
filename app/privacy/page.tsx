import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d14] text-[#f0f0ff] px-5 py-12"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div className="max-w-[640px] mx-auto">

        <Link href="/" className="inline-flex items-center gap-2 text-[.78rem] text-[#9494b8] hover:text-white transition-colors mb-8">
          ← Back
        </Link>

        <div className="text-[1.4rem] font-extrabold tracking-tight mb-2">
          Physi<span style={{ background:'linear-gradient(135deg,#a882ff,#6eb3ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Q</span>
        </div>
        <h1 className="text-[1.5rem] font-extrabold tracking-tight mb-1">Privacy Policy</h1>
        <p className="text-[#55556e] text-[.78rem] mb-8">Last updated: April 2026</p>

        <div className="space-y-8 text-[.84rem] text-[#9494b8] leading-relaxed">

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">1. What we collect</h2>
            <p>When you create an account we collect your email address, phone number, and country. When you use the scan feature, we temporarily process the photos you upload to generate your fitness analysis. We also collect usage data such as scan history and credit transactions.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">2. How we use your data</h2>
            <p>Your photos are sent to OpenAI's GPT-4o Vision API for analysis and are stored in our secure Supabase storage bucket. We use your email to send account confirmation and important service updates. We do not sell your data to any third party.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">3. Photo storage and deletion</h2>
            <p>Photos you upload are stored privately and are not publicly accessible. You can request deletion of your photos and account data at any time from your profile settings. Deleted data is permanently removed within 30 days.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">4. Third-party services</h2>
            <p>We use the following services to operate PhysiQ: Supabase (database and file storage), OpenAI (AI analysis), and Vercel (hosting). Each service has its own privacy policy governing their use of data.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">5. Medical disclaimer</h2>
            <p>PhysiQ provides general fitness guidance only. All body composition figures are visual estimates, not clinical measurements. Nothing on this platform constitutes medical advice. Always consult a qualified healthcare professional before starting any diet or exercise program.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">6. Analytics</h2>
            <p>We use PostHog and Microsoft Clarity to understand how users interact with our app. This includes anonymised event tracking and session recordings. You can opt out by disabling JavaScript or using a content blocker.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">7. Your rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, use the data deletion option in your profile or contact us directly.</p>
          </section>

          <section>
            <h2 className="text-[1rem] font-bold text-[#f0f0ff] mb-3">8. Contact</h2>
            <p>For any privacy-related questions, contact us through the app or at the email address associated with your account.</p>
          </section>

        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.08]">
          <Link href="/auth?tab=signup"
            className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl text-[.84rem]"
            style={{ background:'linear-gradient(135deg,#a882ff,#6eb3ff)' }}>
            Back to sign up
          </Link>
        </div>

      </div>
    </div>
  )
}
