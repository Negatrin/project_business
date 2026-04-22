import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Megaphone, TrendingUp, Eye, MousePointer, DollarSign, Info } from 'lucide-react'

interface PageProps { params: { locale: string } }

const AD_SLOTS = [
  { id: 'homepage_hero', name: 'Homepage Hero', description: 'Top banner on the homepage — maximum visibility', currentBid: 2000, impressions: '15,000+', icon: '🏠' },
  { id: 'homepage_featured', name: 'Featured Section', description: 'Appear in the "Featured Services" grid on homepage', currentBid: 800, impressions: '8,000+', icon: '⭐' },
  { id: 'search_top', name: 'Search Top Spot', description: 'First result in relevant search queries', currentBid: 500, impressions: '5,000+', icon: '🔍' },
]

const ACTIVE_CAMPAIGNS = [
  { id: 'c1', slot: 'Featured Section', gigTitle: 'Professional Logo Design', bid: 900, spend: 3600, impressions: 12400, clicks: 347, status: 'active', endDate: 'Apr 30' },
]

export default async function AdsPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('ads')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-2 flex items-center gap-3">
        <Megaphone className="h-7 w-7 text-[#1dbf73]" />
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      </div>
      <p className="mb-8 text-gray-500">{t('subtitle')}</p>

      {/* Active campaigns */}
      {ACTIVE_CAMPAIGNS.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{t('activeCampaigns')}</h2>
          {ACTIVE_CAMPAIGNS.map((c) => (
            <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="green">Active</Badge>
                    <span className="text-sm text-gray-500">{c.slot}</span>
                  </div>
                  <p className="mt-1 font-semibold text-gray-900">{c.gigTitle}</p>
                  <p className="text-sm text-gray-500">Ends {c.endDate} · PKR {c.bid}/day bid</p>
                </div>
                <Button variant="danger" size="sm">Pause</Button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <Eye className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                  <p className="text-lg font-bold text-gray-900">{c.impressions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{t('impressions')}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <MousePointer className="mx-auto mb-1 h-4 w-4 text-green-500" />
                  <p className="text-lg font-bold text-gray-900">{c.clicks}</p>
                  <p className="text-xs text-gray-500">{t('clicks')}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <DollarSign className="mx-auto mb-1 h-4 w-4 text-purple-500" />
                  <p className="text-lg font-bold text-gray-900">PKR {c.spend.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{t('spend')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available slots */}
      <h2 className="mb-4 text-lg font-bold text-gray-900">Available Ad Slots</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {AD_SLOTS.map((slot) => (
          <Card key={slot.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="mb-3 text-3xl">{slot.icon}</div>
            <h3 className="font-bold text-gray-900">{slot.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{slot.description}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t('currentBid')}</span>
                <span className="font-semibold text-gray-900">PKR {slot.currentBid}/{t('perDay')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t('impressions')}</span>
                <span className="font-semibold text-green-600">{slot.impressions}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-gray-700">{t('yourBid')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={slot.currentBid + 1}
                  placeholder={`Min PKR ${slot.currentBid + 1}`}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1dbf73] focus:outline-none"
                />
              </div>
              <Button size="sm" className="mt-2 w-full flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('placeBid')}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{t('comingSoon')}. Bids are processed daily. The highest bidder gets the slot for that day.</p>
      </div>
    </div>
  )
}
