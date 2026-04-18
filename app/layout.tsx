import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhysiQ — AI Fitness Analysis',
  description: 'Upload your photo. Get a personalized workout plan, diet plan, and physique analysis powered by GPT-4o Vision.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
