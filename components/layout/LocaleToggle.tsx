'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export function LocaleToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function toggle() {
    const next = locale === 'en' ? 'ur' : 'en'
    // Replace /en/ or /ur/ prefix in path
    const newPath = pathname.replace(/^\/(en|ur)/, `/${next}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#1dbf73] hover:text-[#1dbf73]"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      {locale === 'en' ? 'اردو' : 'English'}
    </button>
  )
}
