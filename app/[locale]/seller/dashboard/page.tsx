'use server'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import Link from 'next/link'
import { ShoppingBag, TrendingUp, Plus, Edit, Pause, Megaphone, DollarSign, MessageSquare, Clock } from 'lucide-react'

interface PageProps { params: { locale: string } }

const MY_GIGS = [
  { id: '1', title: 'Professional Logo Design for Your Business', category: 'design', status: 'active', orders: 342, rating: 4.9, reviews: 127, price: 2500, isSponsored: true },
  { id: '3', title: 'SEO-Optimized Urdu & English Content Writing', category: 'writing', status: 'active', orders: 119, rating: 4.7, reviews: 54, price: 1500, isSponsored: false },
  { id: 'g3', title: 'Social Media Management & Content Strategy', category: 'social', status: 'paused', orders: 28, rating: 4.6, reviews: 12, price: 5000, isSponsored: false },
]

const RECENT_MESSAGES = [
  { id: 'm1', from: 'Junaid Ansari', text: 'Can you deliver by Friday?', time: '2h ago' },
  { id: 'm2', from: 'Sara Ahmed', text: 'Please share the source files.', time: '5h ago' },
  { id: 'm3', from: 'Ali Raza', text: 'Looks great! Approving now.', time: '1d ago' },
]

export default async function SellerDashboardPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('seller')

  const stats = [
    { label: 'Total Earnings', value: 'PKR 342,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Orders', value: '8', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: '489', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Avg Rating', value: '4.8★', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, <strong>{session.user.name}</strong></p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/seller/ads`}>
            <Button variant="outline" className="flex items-center gap-2" size="sm">
              <Megaphone className="h-4 w-4" />
              Advertise
            </Button>
          </Link>
          <Link href={`/${locale}/seller/gigs/new`}>
            <Button className="flex items-center gap-2" size="sm">
              <Plus className="h-4 w-4" />
              {t('createGig')}
            </Button>
          </Link>
        </div>
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gigs — takes 2/3 */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{t('myGigs')}</h2>
            <Link href={`/${locale}/seller/gigs`} className="text-sm text-[#1dbf73] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {MY_GIGS.map((gig) => (
              <div key={gig.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 truncate">{gig.title}</p>
                    {gig.isSponsored && <Badge variant="sponsored">Sponsored</Badge>}
                    <Badge variant={gig.status === 'active' ? 'green' : 'yellow'}>{gig.status}</Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <StarRating rating={gig.rating} count={gig.reviews} />
                    <span>{gig.orders} orders</span>
                    <span className="font-medium text-gray-700">From PKR {gig.price.toLocaleString('en-PK')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href={`/${locale}/seller/gigs/${gig.id}/edit`}>
                    <button className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <button className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50">
                    <Pause className="h-4 w-4" />
                  </button>
                  <Link href={`/${locale}/seller/ads?gigId=${gig.id}`}>
                    <button className="rounded-lg border border-amber-200 bg-amber-50 p-1.5 text-amber-600 hover:bg-amber-100">
                      <Megaphone className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent messages — 1/3 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Messages</h2>
            <Link href={`/${locale}/inbox`} className="text-sm text-[#1dbf73] hover:underline">Open Inbox</Link>
          </div>
          <div className="space-y-3">
            {RECENT_MESSAGES.map((msg) => (
              <Link key={msg.id} href={`/${locale}/inbox`}>
                <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition-shadow cursor-pointer">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1dbf73]/10 text-[#1dbf73]">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{msg.from}</p>
                    <p className="text-xs text-gray-500 truncate">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{msg.time}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href={`/${locale}/seller/wallet`} className="mt-4 block">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <DollarSign className="h-4 w-4" />
              View Earnings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
