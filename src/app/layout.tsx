import type { Metadata } from 'next'
import { Hanken_Grotesk, Source_Sans_3, Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-source-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

const organicHand = localFont({
  src: './fonts/Hello-OrganicHand.otf',
  variable: '--font-organic-hand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zhu Nan — Product Designer',
  description: 'Principal Product Designer with 10 years of experience in Fintech and AgTech.',
  icons: {
    icon: '/yarn-favicon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${sourceSans.variable} ${spaceMono.variable} ${organicHand.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
