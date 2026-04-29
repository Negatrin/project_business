import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { gigs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import Link from 'next/link'
import { Plus, Edit, Pause, Trash2, Megaphone } from 'lucide-react'

interface PageProps { params: { locale: string } }

export default async function MyGigsPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('seller')

  const myGigs = await db
    .select()
    .from(gigs)
    .where(eq(gigs.sellerId, session.user.id))
    .orderBy(gigs.createdAt)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('myGigs')}</h1>
        <Link href={`/${locale}/seller/gigs/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('createGig')}
          </Button>
        </Link>
      </div>

      {myGigs.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl mb-4">🎨</p>
          <h2 className="text-xl font-bold text-gray-900">{t('noGigs')}</h2>
          <p className="text-gray-500 mt-2 mb-6">Create your first service and start earning</p>
          <Link href={`/${locale}/seller/gigs/new`}>
            <Button>{t('startEarning')}</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 text-start">Service</th>
                <th className="px-5 py-3 text-start hidden md:table-cell">Orders</th>
                <th className="px-5 py-3 text-start hidden sm:table-cell">Rating</th>
                <th className="px-5 py-3 text-start">Status</th>
                <th className="px-5 py-3 text-end">Price</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myGigs.map((gig) => (
                <tr key={gig.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <Link href={`/${locale}/gigs/${gig.id}`} className="text-sm font-medium text-gray-900 hover:text-[#1dbf73] line-clamp-1">
                        {gig.title}
                      </Link>
                      {gig.isSponsored && <Badge variant="sponsored" className="mt-1">Sponsored</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{gig.totalOrders}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <StarRating rating={parseFloat(String(gig.avgRating ?? 0))} count={gig.totalReviews ?? 0} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={gig.status === 'active' ? 'green' : 'yellow'}>
                      {gig.status === 'active' ? t('activeGigs') : t('pausedGigs')}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-end text-sm font-semibold text-gray-900">
                    PKR {gig.tier1Price.toLocaleString('en-PK')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/${locale}/seller/gigs/${gig.id}/edit`}>
                        <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <Pause className="h-4 w-4" />
                      </button>
                      <Link href={`/${locale}/seller/ads?gigId=${gig.id}`}>
                        <button className="rounded p-1.5 text-amber-500 hover:bg-amber-50">
                          <Megaphone className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="rounded p-1.5 text-red-400 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
