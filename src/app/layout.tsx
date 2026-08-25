import type { Metadata } from 'next'
import { Marcellus, DM_Sans, Playfair_Display, Space_Mono } from 'next/font/google'
import './globals.css'

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  style: ['italic', 'normal'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
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
    <html lang="en" className={`${marcellus.variable} ${dmSans.variable} ${playfair.variable} ${spaceMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
