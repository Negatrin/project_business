'use client'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface SortSelectProps {
  options: { value: string; label: string }[]
  currentSort: string
}

export function SortSelect({ options, currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = params.locale as string

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams.toString())
    next.set('sort', e.target.value)
    router.push(`/${locale}/search?${next.toString()}`)
  }

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={handleChange}
        className="appearance-none rounded-lg border border-gray-200 bg-white pe-7 ps-3 py-1.5 text-sm focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute inset-y-0 end-2 my-auto h-4 w-4 text-gray-400" />
    </div>
  )
}
