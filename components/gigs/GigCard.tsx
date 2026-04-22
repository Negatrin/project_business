import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { StarRating } from '@/components/ui/star-rating'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GigCardProps {
  gig: {
    id: string
    title: string
    sellerId: string
    sellerName: string
    sellerAvatar?: string | null
    sellerUsername: string
    cnicVerified: boolean
    tier1Price: number
    tier2Price?: number
    tier3Price?: number
    tier1DeliveryDays: number
    avgRating: string | number
    totalReviews: number
    isSponsored?: boolean
    images: string[]
    category?: string
  }
  locale: string
  sponsored?: string
  startingAt?: string
  deliveryDays?: string
  className?: string
}

export function GigCard({ gig, locale, sponsored, startingAt, deliveryDays, className }: GigCardProps) {
  const rating = typeof gig.avgRating === 'string' ? parseFloat(gig.avgRating) : gig.avgRating

  return (
    <div className={cn('group', className)}>
      <Link href={`/${locale}/gigs/${gig.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl">
          {/* Sponsored badge */}
          {gig.isSponsored && (
            <div className="absolute start-2 top-2 z-10">
              <Badge variant="sponsored">{sponsored ?? 'Sponsored'}</Badge>
            </div>
          )}

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            {gig.images[0] ? (
              <Image
                src={gig.images[0]}
                alt={gig.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-green-100 to-emerald-200" />
            )}
          </div>
        </div>

        {/* Seller row */}
        <div className="mt-3 flex items-center gap-2">
          <Avatar src={gig.sellerAvatar} name={gig.sellerName} size="sm" />
          <span className="text-sm font-medium text-gray-800">{gig.sellerName}</span>
          {gig.cnicVerified && (
            <ShieldCheck className="h-4 w-4 text-[#1dbf73]" />
          )}
        </div>

        {/* Title */}
        <h3 className="mt-1.5 line-clamp-2 text-sm text-gray-700 leading-snug group-hover:text-[#1dbf73] transition-colors">
          {gig.title}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="mt-1.5">
            <StarRating rating={rating} count={gig.totalReviews} />
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="text-xs text-gray-500">{startingAt ?? 'Starting at'}</span>
          <span className="text-base font-bold text-gray-900">
            PKR {gig.tier1Price.toLocaleString('en-PK')}
          </span>
        </div>
      </Link>
    </div>
  )
}
