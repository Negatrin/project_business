import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { Clock, Upload, CheckCircle, AlertTriangle, Package, User, Calendar } from 'lucide-react'

interface PageProps {
  params: { locale: string; id: string }
}

const SAMPLE_ORDER = {
  id: 'o1',
  title: 'Professional Logo Design',
  sellerName: 'Ahmed Raza',
  sellerUsername: 'ahmedraza',
  sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  buyerName: 'You',
  status: 'in_progress' as 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed',
  packageTitle: 'Standard',
  grossAmount: 5000,
  commissionRate: 20,
  commissionAmount: 1000,
  netAmount: 4000,
  deliveryDays: 5,
  dueDate: 'Apr 28, 2026',
  requirements: 'Please create a modern logo for my tech startup. Colors: green and white. Style: minimalist.',
}

const statusConfig = {
  pending: { variant: 'yellow' as const, label: 'Pending' },
  in_progress: { variant: 'blue' as const, label: 'In Progress' },
  delivered: { variant: 'green' as const, label: 'Delivered' },
  completed: { variant: 'gray' as const, label: 'Completed' },
  cancelled: { variant: 'red' as const, label: 'Cancelled' },
  disputed: { variant: 'red' as const, label: 'Disputed' },
}

export default async function OrderPage({ params: { locale, id } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('order')
  const order = SAMPLE_ORDER
  const statusInfo = statusConfig[order.status]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
          <p className="text-sm text-gray-500">Order #{id}</p>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: Chat */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
              <Avatar
                src={order.sellerAvatar}
                name={order.sellerName}
                size="md"
              />
              <div>
                <p className="font-semibold text-gray-900">{order.sellerName}</p>
                <p className="flex items-center gap-1 text-xs text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </p>
              </div>
            </div>
            <ChatWindow
              orderId={id}
              currentUserId={session.user.id}
              currentUserName={session.user.name}
              otherUserId="u1"
              otherUserName={order.sellerName}
            />
          </div>
        </div>

        {/* Right: Order details */}
        <div className="w-full lg:w-72 xl:w-80 space-y-4">
          {/* Details card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-gray-900">{t('orderDetails')}</h2>

            {[
              { icon: Package, label: t('package'), value: order.packageTitle },
              { icon: User, label: t('seller'), value: order.sellerName },
              { icon: Clock, label: t('dueDate'), value: order.dueDate },
              { icon: Calendar, label: t('amount'), value: `PKR ${order.grossAmount.toLocaleString('en-PK')}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2.5">
                <row.icon className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 w-24">{row.label}</span>
                <span className="text-sm font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-900 text-sm">Requirements</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{order.requirements}</p>
          </div>

          {/* Actions */}
          {order.status === 'in_progress' && (
            <div className="space-y-2">
              <Button variant="outline" className="w-full flex items-center gap-2" size="sm">
                <Upload className="h-4 w-4" />
                {t('uploadFile')}
              </Button>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="space-y-2">
              <Button className="w-full flex items-center gap-2" size="sm">
                <CheckCircle className="h-4 w-4" />
                {t('acceptDelivery')}
              </Button>
              <Button variant="outline" className="w-full" size="sm">{t('requestRevision')}</Button>
              <Button variant="ghost" className="w-full flex items-center gap-2 text-red-600" size="sm">
                <AlertTriangle className="h-4 w-4" />
                {t('raiseDispute')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
