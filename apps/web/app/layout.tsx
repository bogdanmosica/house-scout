import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { LocaleProvider } from '../lib/i18n'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'House Scout',
  description: 'Mobile-first property scouting app',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  themeColor: '#d97757',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-accent="terra"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-svh flex flex-col bg-bg text-ink font-sans">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
