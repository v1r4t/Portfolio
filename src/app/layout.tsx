import type { Metadata, Viewport } from 'next'
import {
  Anek_Devanagari,
  Baloo_Tammudu_2,
  Barlow,
  Modak,
  Space_Mono,
  Teko,
} from 'next/font/google'
import '../styles/theme.css'

const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-teko',
  display: 'swap',
})
const modak = Modak({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-modak',
  display: 'swap',
})
const anek = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-anek',
  display: 'swap',
})
const baloo = Baloo_Tammudu_2({
  subsets: ['telugu', 'latin'],
  weight: '800',
  variable: '--font-baloo',
  display: 'swap',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-spacemono',
  display: 'swap',
})
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dhruva Vura — Designer & Creative Engineer',
    template: '%s — Dhruva Vura',
  },
  description:
    'Dhruva Vura — portfolio fusing authentic Indian highway truck art and high-performance web engineering.',
  openGraph: {
    type: 'website',
    siteName: 'Dhruva Vura',
    locale: 'en_IN',
  },
}

export const viewport: Viewport = {
  themeColor: '#45107a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${teko.variable} ${modak.variable} ${anek.variable} ${baloo.variable} ${spaceMono.variable} ${barlow.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
