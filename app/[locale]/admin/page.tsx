import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Shield, Users, ShoppingBag, DollarSign, CheckCircle, XCircle } from 'lucide-react'

interface PageProps { params: { locale: string } }

const PENDING_VERIFICATIONS = [
  { id: 'v1', name: 'Hassan Ahmed', username: 'hassanahmed', cnic: '35202-1234567-8', submitted: '2h ago', front: 'CNIC Front', back: 'CNIC Back' },
  { id: 'v2', name: 'Ayesha Tariq', username: 'ayeshatariq', cnic: '42201-9876543-1', submitted: '5h ago', front: 'CNIC Front', back: 'CNIC Back' },
  { id: 'v3', name: 'Zubair Shah', username: 'zubairshah', cnic: '31302-5555555-3', submitted: '1d ago', front: 'CNIC Front', back: 'CNIC Back' },
]

export default async function AdminPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect(`/${locale}`)

  const t = await getTranslations('admin')

  const stats = [
    { label: t('users'), value: '12,483', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t('gigs'), value: '4,721', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
    { label: t('orders'), value: '28,902', icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: t('revenue'), value: 'PKR 5.2M', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-7 w-7 text-[#1dbf73]" />
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <Badge variant="red">Admin Only</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Commission config */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-gray-900">{t('commissionRate')}</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="number"
              defaultValue={20}
              min={0}
              max={50}
              className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm pe-8 focus:border-[#1dbf73] focus:outline-none"
            />
            <span className="absolute inset-y-0 end-3 flex items-center text-gray-400 text-sm">%</span>
          </div>
          <Button size="sm">{t('updateRate')}</Button>
          <p className="text-sm text-gray-500">Currently charging 20% on all completed orders</p>
        </div>
      </div>

      {/* CNIC Verification queue */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t('pendingVerifications')}</h2>
          <Button variant="secondary" size="sm">{t('approveAll')}</Button>
        </div>

        {PENDING_VERIFICATIONS.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-300" />
            <p>{t('noVerifications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {PENDING_VERIFICATIONS.map((v) => (
              <div key={v.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <Avatar name={v.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{v.name}</p>
                  <p className="text-xs text-gray-500">@{v.username} · CNIC: {v.cnic}</p>
                  <p className="text-xs text-gray-400">Submitted {v.submitted}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    View CNIC
                  </button>
                  <Badge variant="yellow">Pending</Badge>
                  <button className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {t('approve')}
                  </button>
                  <button className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">
                    <XCircle className="h-3.5 w-3.5" />
                    {t('reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
