'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: React.ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap',
            className,
          )}
        >
          {content}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
}
