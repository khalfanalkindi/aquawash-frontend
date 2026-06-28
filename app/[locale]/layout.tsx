import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { AppProviders } from '@/components/app-providers'
import { routing, type Locale } from '@/i18n/routing'
import { localeDirection } from '@/lib/localized'
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AquaWash POS - Professional Laundry',
  description: 'Professional laundry and dry cleaning point of sale system',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AquaWash POS',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0891b2',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = localeDirection(locale)

  return (
    <html lang={locale} dir={dir} className="bg-background" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${notoArabic.variable} font-sans antialiased`}
        style={{ fontFamily: dir === 'rtl' ? 'var(--font-noto-arabic), var(--font-geist), sans-serif' : undefined }}
      >
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AppProviders>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <div id="receipt-print-root" className="hidden print:block" aria-hidden="true" />
      </body>
    </html>
  )
}
