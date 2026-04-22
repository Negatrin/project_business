import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { auth } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SessionProvider } from 'next-auth/react'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!routing.locales.includes(locale as 'en' | 'ur')) {
    notFound()
  }

  const messages = await getMessages()
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <div
          dir={locale === 'ur' ? 'rtl' : 'ltr'}
          lang={locale}
          className={`flex min-h-screen flex-col ${locale === 'ur' ? 'font-urdu' : 'font-sans'}`}
        >
          <Header user={session?.user ?? null} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
