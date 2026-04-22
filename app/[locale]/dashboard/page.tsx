import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag, CheckCircle, MessageSquare, DollarSign, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { locale: string }
}

const SAMPLE_ORDERS = [
  { id: 'o1', title: 'Professional Logo Design', seller: 'Ahmed Raza', status: 'in_progress', amount: 2500, dueDate: '2 days' },
  { id: 'o2', title: 'Next.js Website Development', seller: 'Sara Khan', status: 'delivered', amount: 15000, dueDate: 'Delivered' },
  { id: 'o3', title: 'SEO Content Writing', seller: 'Fatima Malik', status: 'completed', amount: 1500, dueDate: 'Completed' },
]

const statusVariants: Record<string, 'green' | 'yellow' | 'blue' | 'gray'> = {
  pending: 'yellow', in_progress: 'blue', delivered: 'green', completed: 'gray', cancelled: 'red' as 'gray',
}

export default async function DashboardPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('dashboard')
  const to = await getTranslations('order')

  const stats = [
    { label: t('activeOrders'), value: '2', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t('completedOrders'), value: '14', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: t('pendingMessages'), value: '3', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: t('totalSpent'), value: 'PKR 45,000', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500">Welcome back, <strong>{session.user.name}</strong></p>
        </div>
        <Link href={`/${locale}/search`}>
          <Button>{t('browseGigs')}</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t('recentOrders')}</h2>
          <Link href={`/${locale}/orders`} className="flex items-center gap-1 text-sm text-[#1dbf73] hover:underline">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 text-start">Service</th>
                <th className="px-5 py-3 text-start hidden md:table-cell">Seller</th>
                <th className="px-5 py-3 text-start">Status</th>
                <th className="px-5 py-3 text-start hidden sm:table-cell">Due</th>
                <th className="px-5 py-3 text-end">Amount</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SAMPLE_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{order.title}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{order.seller}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariants[order.status] ?? 'gray'}>
                      {to(order.status as Parameters<typeof to>[0])}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {order.dueDate}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-end">
                    <p className="text-sm font-semibold text-gray-900">PKR {order.amount.toLocaleString('en-PK')}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/${locale}/orders/${order.id}`}>
                      <button className="text-[#1dbf73] hover:underline text-sm">View</button>
                    </Link>
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
