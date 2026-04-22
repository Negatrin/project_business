import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = { sm: 8, md: 10, lg: 14, xl: 20 }
const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-xl' }

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const px = sizes[size] * 4
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-[#1dbf73] font-semibold text-white overflow-hidden',
        `w-${sizes[size]} h-${sizes[size]}`,
        textSizes[size],
        className,
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" sizes={`${px}px`} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
