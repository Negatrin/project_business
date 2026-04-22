import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SAMPLE_GIGS } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { ShieldCheck, Clock, RefreshCw, CheckCircle2, Info, ChevronRight } from 'lucide-react'

interface GigPageProps {
  params: { locale: string; id: string }
}

export default async function GigPage({ params: { locale, id } }: GigPageProps) {
  const gig = SAMPLE_GIGS.find((g) => g.id === id)
  if (!gig) notFound()

  const t = await getTranslations('gig')
  const rating = parseFloat(String(gig.avgRating))

  const tiers = [
    { key: 'basic', title: t('basic'), price: gig.tier1Price, days: gig.tier1DeliveryDays, revisions: 1 },
    { key: 'standard', title: t('standard'), price: gig.tier2Price ?? gig.tier1Price * 2, days: gig.tier1DeliveryDays * 2, revisions: 3 },
    { key: 'premium', title: t('premium'), price: gig.tier3Price ?? gig.tier1Price * 3, days: gig.tier1DeliveryDays * 3, revisions: -1 },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href={`/${locale}`} className="hover:text-[#1dbf73]">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/${locale}/search?category=${gig.category}`} className="hover:text-[#1dbf73]">{gig.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-700 truncate max-w-xs">{gig.title}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left: Main content */}
        <div className="flex-1">
          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{gig.title}</h1>
            {gig.isSponsored && <Badge variant="sponsored">{t('sponsored')}</Badge>}
          </div>

          {/* Seller info */}
          <div className="mt-4 flex items-center gap-3">
            <Link href={`/${locale}/profile/${gig.sellerUsername}`}>
              <Avatar src={gig.sellerAvatar} name={gig.sellerName} size="md" />
            </Link>
            <div>
              <Link href={`/${locale}/profile/${gig.sellerUsername}`}
                className="font-semibold text-gray-900 hover:text-[#1dbf73]">
                {gig.sellerName}
              </Link>
              {gig.cnicVerified && (
                <div className="flex items-center gap-1 text-xs text-[#1dbf73]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Identity Verified</span>
                </div>
              )}
            </div>
            <div className="ms-auto">
              <StarRating rating={rating} count={gig.totalReviews} size="md" />
            </div>
          </div>

          {/* Image gallery */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <div className="relative aspect-video">
              {gig.images[0] ? (
                <Image
                  src={gig.images[0]}
                  alt={gig.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-green-100 to-emerald-200" />
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">{t('about')}</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Professional service with guaranteed satisfaction. I bring years of experience to deliver
              high-quality results tailored to your specific needs. My focus is on understanding your
              vision and exceeding your expectations with every delivery.
            </p>
            <ul className="mt-4 space-y-2">
              {['Fast turnaround time', 'Unlimited revisions until satisfied', 'Source files included', '100% original work'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-[#1dbf73]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">{t('reviews_section')}</h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-5xl font-extrabold text-gray-900">{rating.toFixed(1)}</span>
              <div>
                <StarRating rating={rating} count={gig.totalReviews} size="md" />
                <p className="mt-1 text-sm text-gray-500">{gig.totalReviews} reviews</p>
              </div>
            </div>
            {/* Sample reviews */}
            {[
              { name: 'Ali Hassan', rating: 5, text: 'Excellent work, very professional and on time!', date: '2 days ago' },
              { name: 'Maria Khan', rating: 5, text: 'Amazing quality, would definitely recommend to anyone.', date: '1 week ago' },
            ].map((r) => (
              <div key={r.name} className="mt-5 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <StarRating rating={r.rating} className="ms-auto" />
                </div>
                <p className="mt-2 text-sm text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pricing card */}
        <div className="w-full lg:w-80 xl:w-96">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            {/* Tier tabs */}
            <div className="grid grid-cols-3 border-b border-gray-200">
              {tiers.map((tier, i) => (
                <button key={tier.key} className={`py-3 text-sm font-semibold transition-colors ${i === 0 ? 'bg-[#1dbf73] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {tier.title}
                </button>
              ))}
            </div>

            {/* Pricing detail — shows Basic by default */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{tiers[0].title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Core deliverables included</p>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">
                  PKR {tiers[0].price.toLocaleString('en-PK')}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{tiers[0].days} {t('days')} {t('deliveryTime')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                  <span>{tiers[0].revisions} {t('revisions')}</span>
                </div>
              </div>

              {/* Commission tooltip */}
              <div className="mt-4 rounded-lg bg-gray-50 p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500">
                  A 5% service fee applies at checkout. The seller receives 80% after a 20% platform commission.
                </p>
              </div>

              <Link href={`/${locale}/checkout/${gig.id}?tier=1`} className="mt-5 block">
                <Button size="lg" className="w-full">{t('orderNow')}</Button>
              </Link>
              <Link href={`/${locale}/inbox`} className="mt-2 block">
                <Button size="lg" variant="outline" className="w-full">{t('contactSeller')}</Button>
              </Link>
            </div>

            {/* All 3 tiers quick view */}
            <div className="border-t border-gray-100 px-5 py-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{t('pricing')}</p>
              {tiers.map((tier) => (
                <div key={tier.key} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-gray-700">{tier.title}</span>
                  <span className="font-semibold text-gray-900">PKR {tier.price.toLocaleString('en-PK')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
