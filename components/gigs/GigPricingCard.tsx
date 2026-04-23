'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { Clock, RefreshCw, Info } from 'lucide-react'
import Link from 'next/link'

interface Tier {
  key: string
  title: string
  price: number
  days: number
  revisions: number
}

interface GigPricingCardProps {
  tiers: Tier[]
  gigId: string
  locale: string
  labels: {
    orderNow: string
    contactSeller: string
    deliveryTime: string
    revisions: string
    days: string
    unlimited: string
    pricing: string
  }
}

export function GigPricingCard({ tiers, gigId, locale, labels }: GigPricingCardProps) {
  const [active, setActive] = useState(0)
  const tier = tiers[active]

  return (
    <div className="sticky top-24 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      {/* Tier tabs */}
      <div className="grid grid-cols-3 border-b border-gray-200">
        {tiers.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setActive(i)}
            className={`py-3 text-sm font-semibold transition-colors ${
              i === active
                ? 'bg-[#1dbf73] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Active tier detail */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-gray-900">{tier.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">Core deliverables included</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            PKR {tier.price.toLocaleString('en-PK')}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{tier.days} {labels.days} {labels.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RefreshCw className="h-4 w-4 text-gray-400" />
            <span>
              {tier.revisions === -1 ? labels.unlimited : tier.revisions} {labels.revisions}
            </span>
          </div>
        </div>

        {/* Commission tooltip */}
        <div className="mt-4 rounded-lg bg-gray-50 p-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500">
            A 5% service fee applies at checkout. The seller receives 80% after a 20% platform commission.
          </p>
        </div>

        <Link href={`/${locale}/checkout/${gigId}?tier=${active + 1}`} className="mt-5 block">
          <Button size="lg" className="w-full">{labels.orderNow}</Button>
        </Link>
        <Link href={`/${locale}/inbox`} className="mt-2 block">
          <Button size="lg" variant="outline" className="w-full">{labels.contactSeller}</Button>
        </Link>
      </div>

      {/* All 3 tiers quick view */}
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{labels.pricing}</p>
        {tiers.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setActive(i)}
            className={`flex w-full items-center justify-between py-1.5 text-sm transition-colors rounded px-1 -mx-1 ${
              i === active ? 'text-[#1dbf73] font-semibold' : 'text-gray-700 hover:text-[#1dbf73]'
            }`}
          >
            <span>{t.title}</span>
            <span className="font-semibold">PKR {t.price.toLocaleString('en-PK')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
