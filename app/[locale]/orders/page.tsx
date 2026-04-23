import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, ChevronRight, ShoppingBag } from 'lucide-react'

interface PageProps {
  params: { locale: string }
}

const SAMPLE_ORDERS = [
  { id: 'o1', title: 'Professional Logo Design', seller: 'Ahmed Raza', status: 'in_progress', amount: 5000, dueDate: 'Apr 28, 2026', package: 'Standard' },
  { id: 'o2', title: 'Next.js Website Development', seller: 'Sara Khan', status: 'delivered', amount: 15000, dueDate: 'Delivered', package: 'Basic' },
  { id: 'o3', title: 'SEO Content Writing', seller: 'Fatima Malik', status: 'completed', amount: 1500, dueDate: 'Completed', package: 'Basic' },
  { id: 'o4', title: 'Social Media Management', seller: 'Usman Ali', status: 'pending', amount: 5000, dueDate: 'May 5, 2026', package: 'Standard' },
]

const statusVariants: Record<string, 'green' | 'yellow' | 'blue' | 'gray'> = {
  pending: 'yellow',
  in_progress: 'blue',
  delivered: 'green',
  completed: 'gray',
  cancelled: 'gray',
  disputed: 'yellow',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
}

export default async function OrdersPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{SAMPLE_ORDERS.length} total orders</p>
        </div>
        <Link href={`/${locale}/search`}>
          <Button className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Browse Services
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit">
        {['All', 'Active', 'Delivered', 'Completed'].map((tab, i) => (
          <button
            key={tab}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {SAMPLE_ORDERS.length === 0 ? (
        <div className="py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700">No orders yet</h2>
          <p className="mt-1 text-sm text-gray-500">Browse services to place your first order</p>
          <Link href={`/${locale}/search`} className="mt-4 inline-block">
            <Button>Browse Services</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {SAMPLE_ORDERS.map((order) => (
            <Link
              key={order.id}
              href={`/${locale}/orders/${order.id}`}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1dbf73]/10">
                <ShoppingBag className="h-6 w-6 text-[#1dbf73]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 truncate">{order.title}</p>
                  <Badge variant={statusVariants[order.status] ?? 'gray'}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  {order.package} package · by <span className="font-medium text-gray-700">{order.seller}</span>
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {order.dueDate}
                </div>
              </div>

              <div className="shrink-0 text-end">
                <p className="font-bold text-gray-900">PKR {order.amount.toLocaleString('en-PK')}</p>
                <p className="mt-0.5 text-xs text-gray-400">Order #{order.id}</p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
