import { getTranslations } from 'next-intl/server'
import { GigCard } from '@/components/gigs/GigCard'
import { SAMPLE_GIGS, CATEGORIES } from '@/lib/utils'
import { SortSelect } from '@/components/search/SortSelect'
import { SlidersHorizontal } from 'lucide-react'

interface SearchPageProps {
  params: { locale: string }
  searchParams: { q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string }
}

export default async function SearchPage({ params: { locale }, searchParams }: SearchPageProps) {
  const t = await getTranslations('search')
  const tc = await getTranslations('categories')
  const tg = await getTranslations('gig')

  const { q, category, sort } = searchParams

  let gigs = [...SAMPLE_GIGS]
  if (q) gigs = gigs.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()))
  if (category) gigs = gigs.filter((g) => g.category === category)
  if (sort === 'lowToHigh') gigs.sort((a, b) => a.tier1Price - b.tier1Price)
  if (sort === 'highToLow') gigs.sort((a, b) => b.tier1Price - a.tier1Price)
  if (sort === 'bestSelling') gigs.sort((a, b) => b.totalOrders - a.totalOrders)

  const sponsored = gigs.filter((g) => g.isSponsored)
  const regular = gigs.filter((g) => !g.isSponsored)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `${gigs.length} ${t('results')} "${q}"` : tc('all')}
        </h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-4 w-4 text-gray-600" />
              <h2 className="font-semibold text-gray-900">{t('filters')}</h2>
            </div>

            {/* Category filter */}
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">{t('category')}</h3>
              <ul className="space-y-1.5">
                <li>
                  <a href={`/${locale}/search${q ? `?q=${q}` : ''}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${!category ? 'bg-[#1dbf73]/10 font-medium text-[#1dbf73]' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {tc('all')}
                  </a>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.key}>
                    <a
                      href={`/${locale}/search?${q ? `q=${q}&` : ''}category=${cat.key}`}
                      className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${category === cat.key ? 'bg-[#1dbf73]/10 font-medium text-[#1dbf73]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.icon} {tc(cat.key as Parameters<typeof tc>[0])}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Budget */}
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">{t('budget')} (PKR)</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm" />
                <input type="number" placeholder="Max" className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm" />
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">{t('deliveryTime')}</h3>
              {['1', '3', '7', '14'].map((d) => (
                <label key={d} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-600">
                  <input type="checkbox" className="accent-[#1dbf73]" />
                  Up to {d} days
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main results */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">{gigs.length} services available</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('sortBy')}:</span>
              <SortSelect
                currentSort={sort ?? 'relevant'}
                options={[
                  { value: 'relevant', label: t('relevant') },
                  { value: 'bestSelling', label: t('bestSelling') },
                  { value: 'newest', label: t('newest') },
                  { value: 'lowToHigh', label: t('lowToHigh') },
                  { value: 'highToLow', label: t('highToLow') },
                ]}
              />
            </div>
          </div>

          {gigs.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-semibold">{t('noResults')}</p>
              <p className="text-sm">{t('tryAdjusting')}</p>
            </div>
          ) : (
            <>
              {/* Sponsored at top */}
              {sponsored.length > 0 && (
                <div className="mb-6 rounded-xl bg-amber-50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-700">
                    ✦ Sponsored Results
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sponsored.map((gig) => (
                      <GigCard key={gig.id} gig={gig} locale={locale} sponsored={tg('sponsored')} startingAt={tg('startingAt')} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular results */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {regular.map((gig) => (
                  <GigCard key={gig.id} gig={gig} locale={locale} sponsored={tg('sponsored')} startingAt={tg('startingAt')} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
