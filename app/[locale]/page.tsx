import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { GigCard } from '@/components/gigs/GigCard'
import { SAMPLE_GIGS, CATEGORIES } from '@/lib/utils'
import { Search, Shield, CreditCard, Star, ChevronRight } from 'lucide-react'

interface PageProps {
  params: { locale: string }
}

export default async function HomePage({ params: { locale } }: PageProps) {
  const t = await getTranslations('home')
  const th = await getTranslations('hero')
  const tc = await getTranslations('categories')
  const tg = await getTranslations('gig')

  const sponsored = SAMPLE_GIGS.filter((g) => g.isSponsored)
  const featured = SAMPLE_GIGS.filter((g) => !g.isSponsored)

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            {th('title')}
          </h1>
          <p className="mt-4 text-lg text-gray-300">{th('subtitle')}</p>

          {/* Search bar */}
          <form action={`/${locale}/search`} method="GET" className="mt-8 flex overflow-hidden rounded-xl bg-white shadow-2xl">
            <input
              name="q"
              type="search"
              placeholder={th('searchPlaceholder')}
              className="flex-1 px-5 py-4 text-gray-900 outline-none text-base"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#1dbf73] px-6 py-4 font-semibold text-white transition-colors hover:bg-[#19a864]"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">{th('searchButton')}</span>
            </button>
          </form>

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            {['Logo Design', 'Web Development', 'Urdu Content', 'Mobile App'].map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-gray-500 px-3 py-1 text-gray-300 transition-colors hover:border-white hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {(['freelancers', 'categories', 'clients'] as const).map((key) => (
              <div key={key}>
                <p className="text-xl font-bold text-[#1dbf73]">{th(`stats.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('popularCategories')}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/search?category=${cat.key}`}
              className="flex flex-col items-center rounded-xl border border-gray-200 p-4 text-center transition-all hover:border-[#1dbf73] hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="mt-2 text-xs font-medium text-gray-700">{tc(cat.key as Parameters<typeof tc>[0])}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Sponsored Gigs ────────────────────────────────────────────────── */}
      <section className="bg-amber-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">{t('sponsoredGigs')}</h2>
              <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-800">Ad</span>
            </div>
            <Link href={`/${locale}/search`} className="flex items-center gap-1 text-sm text-[#1dbf73] hover:underline">
              {t('viewAll')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {sponsored.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                locale={locale}
                sponsored={tg('sponsored')}
                startingAt={tg('startingAt')}
                deliveryDays={tg('deliveryDays')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Gigs ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('featuredGigs')}</h2>
          <Link href={`/${locale}/search`} className="flex items-center gap-1 text-sm text-[#1dbf73] hover:underline">
            {t('viewAll')} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {featured.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              locale={locale}
              sponsored={tg('sponsored')}
              startingAt={tg('startingAt')}
              deliveryDays={tg('deliveryDays')}
            />
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('howItWorks')}</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: Search, title: t('step1Title'), desc: t('step1Desc'), num: '1' },
              { icon: Star, title: t('step2Title'), desc: t('step2Desc'), num: '2' },
              { icon: CreditCard, title: t('step3Title'), desc: t('step3Desc'), num: '3' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1dbf73] text-white shadow-md">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1dbf73]">Step {step.num}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Banner ──────────────────────────────────────────────────── */}
      <section className="bg-[#1dbf73] py-12 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Shield className="mx-auto mb-4 h-10 w-10 opacity-90" />
          <h2 className="text-2xl font-bold">{t('trustedBy')}</h2>
          <p className="mt-2 text-sm opacity-80">All sellers are CNIC-verified. Pay securely with Raast, JazzCash, Easypaisa & SadaPay.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold">
            {['🏦 Raast', '📱 JazzCash', '💚 Easypaisa', '🟣 SadaPay'].map((p) => (
              <span key={p} className="rounded-full bg-white/20 px-4 py-2">{p}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
