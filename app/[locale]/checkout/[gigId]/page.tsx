import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SAMPLE_GIGS } from '@/lib/utils'
import { calculateCommission, formatPKR } from '@/lib/commission'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Lock, Info } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { locale: string; gigId: string }
  searchParams: { tier?: string }
}

export default async function CheckoutPage({ params: { locale, gigId }, searchParams }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const gig = SAMPLE_GIGS.find((g) => g.id === gigId)
  if (!gig) redirect(`/${locale}`)

  const t = await getTranslations('checkout')
  const tier = parseInt(searchParams.tier ?? '1')

  const prices = [gig.tier1Price, gig.tier2Price ?? gig.tier1Price * 2, gig.tier3Price ?? gig.tier1Price * 3]
  const tierNames = ['Basic', 'Standard', 'Premium']
  const price = prices[tier - 1] ?? prices[0]
  const tierName = tierNames[tier - 1] ?? tierNames[0]

  const serviceFee = Math.round(price * 0.05)
  const totalBuyerPays = price + serviceFee
  const { commissionAmount, netAmount } = calculateCommission(price)

  const paymentMethods = [
    { key: 'raast', label: t('raast'), icon: '🏦', available: false },
    { key: 'jazzcash', label: t('jazzcash'), icon: '📱', available: false },
    { key: 'easypaisa', label: t('easypaisa'), icon: '💚', available: false },
    { key: 'sadapay', label: t('sadapay'), icon: '🟣', available: false },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">{t('title')}</h1>

      <div className="flex flex-col gap-6 lg:flex-row-reverse">
        {/* Order summary */}
        <div className="w-full lg:w-80">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-900">{t('orderSummary')}</h2>

            <p className="line-clamp-2 text-sm text-gray-700 font-medium">{gig.title}</p>
            <p className="mt-1 text-xs text-gray-500">by {gig.sellerName}</p>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>{t('package')}</span>
                <span className="font-medium">{tierName}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>{t('price')}</span>
                <span>{formatPKR(price)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span className="flex items-center gap-1">
                  {t('serviceFee')}
                  <span className="text-xs">(5%)</span>
                </span>
                <span>{formatPKR(serviceFee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-2.5 font-bold text-gray-900">
                <span>{t('total')}</span>
                <span className="text-[#1dbf73]">{formatPKR(totalBuyerPays)}</span>
              </div>
            </div>

            {/* What seller receives */}
            <div className="mt-4 rounded-lg bg-green-50 p-3">
              <div className="flex items-start gap-1.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                <div className="text-xs text-green-700 space-y-0.5">
                  <p><strong>Seller receives:</strong> {formatPKR(netAmount)}</p>
                  <p className="text-green-600">After 20% platform commission ({formatPKR(commissionAmount)})</p>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock className="h-3.5 w-3.5 text-[#1dbf73]" />
                {t('securePayment')}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-[#1dbf73]" />
                {t('moneyBack')}
              </div>
            </div>
          </div>
        </div>

        {/* Payment section */}
        <div className="flex-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-gray-900">{t('paymentMethod')}</h2>

            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((m) => (
                <div
                  key={m.key}
                  className="relative rounded-xl border-2 border-gray-200 p-4 opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.icon}</span>
                    <span className="font-medium text-gray-700">{m.label}</span>
                  </div>
                  <Badge variant="yellow" className="mt-2 text-xs">{t('comingSoon')}</Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <strong>Payment Integration Coming Soon</strong>
              <p className="mt-1 text-xs text-blue-600">
                We are integrating Raast, JazzCash, Easypaisa, and SadaPay. Once live, payments will be processed securely in PKR. For now, click below to simulate an order.
              </p>
            </div>

            <div className="mt-5">
              <textarea
                placeholder="Order requirements / special instructions..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#1dbf73] focus:outline-none focus:ring-1 focus:ring-[#1dbf73]"
                rows={3}
              />
            </div>

            <Button size="lg" className="mt-5 w-full" disabled>
              {t('placeOrder')} — {formatPKR(totalBuyerPays)}
            </Button>
            <p className="mt-2 text-center text-xs text-gray-400">
              Payment integration coming soon. Orders will be placed once payments are live.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
