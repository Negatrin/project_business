import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}

export function StarRating({ rating, count, size = 'sm', className }: StarRatingProps) {
  const stars = Math.round(rating * 2) / 2
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i <= stars ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200',
            )}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
