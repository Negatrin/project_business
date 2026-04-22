import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { formatPKR } from '@/lib/commission'
import { TrendingUp, Clock, Wallet, ArrowDownToLine, Info } from 'lucide-react'

interface PageProps { params: { locale: string } }

const SAMPLE_TRANSACTIONS = [
  { id: 't1', date: 'Apr 20, 2026', description: 'Logo Design Order - Ahmed Raza', gross: 5000, commission: 1000, net: 4000, type: 'credit', status: 'completed' },
  { id: 't2', date: 'Apr 15, 2026', description: 'SEO Content Writing - Maria Khan', gross: 3000, commission: 600, net: 2400, type: 'credit', status: 'completed' },
  { id: 't3', date: 'Apr 10, 2026', description: 'Withdrawal to JazzCash', gross: 5000, commission: 0, net: -5000, type: 'debit', status: 'completed' },
  { id: 't4', date: 'Apr 5, 2026', description: 'Social Media Package - Usman Ali', gross: 10000, commission: 2000, net: 8000, type: 'credit', status: 'pending' },
]

export default async function WalletPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('wallet')
  const commissionRate = 20

  const stats = [
    { label: t('totalEarnings'), value: formatPKR(14400), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t('pendingClearance'), value: formatPKR(8000), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: t('availableBalance'), value: formatPKR(6400), icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          {t('withdraw')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-sm text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Commission explainer */}
      <div className="mt-6 rounded-xl border border-[#1dbf73]/30 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#1dbf73]" />
          <div>
            <h3 className="font-semibold text-green-900">How Platform Commission Works</h3>
            <p className="mt-1 text-sm text-green-800">
              SensAi charges a <strong>{commissionRate}%</strong> commission on each completed order.
              This covers payment processing, fraud protection, and platform support.
              For a PKR 10,000 order: you keep <strong>PKR 8,000</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900">{t('transactionHistory')}</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 text-start">{t('date')}</th>
                <th className="px-5 py-3 text-start">{t('description')}</th>
                <th className="px-5 py-3 text-end">
                  <Tooltip content={`Platform commission: ${commissionRate}% of gross amount`}>
                    <span className="flex items-center justify-end gap-1 cursor-help">
                      {t('grossAmount')} <Info className="h-3 w-3" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-5 py-3 text-end hidden sm:table-cell">
                  <Tooltip content={`${commissionRate}% deducted by SensAi`}>
                    <span className="flex items-center justify-end gap-1 cursor-help text-red-600">
                      {t('commission')} <Info className="h-3 w-3" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-5 py-3 text-end font-bold text-green-700">
                  <Tooltip content="Amount you actually receive">
                    <span className="flex items-center justify-end gap-1 cursor-help">
                      {t('netEarnings')} <Info className="h-3 w-3" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-5 py-3 text-center">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SAMPLE_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-500">{tx.date}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-800">{tx.description}</p>
                  </td>
                  <td className="px-5 py-4 text-end text-sm font-medium text-gray-700">
                    {tx.type === 'credit' ? formatPKR(tx.gross) : '—'}
                  </td>
                  <td className="px-5 py-4 text-end hidden sm:table-cell">
                    {tx.commission > 0 ? (
                      <span className="text-sm text-red-500">-{formatPKR(tx.commission)}</span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-end">
                    <span className={`text-sm font-bold ${tx.net > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.net > 0 ? '+' : ''}{formatPKR(Math.abs(tx.net))}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant={tx.status === 'completed' ? 'green' : 'yellow'}>
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
