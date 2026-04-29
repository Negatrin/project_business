import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const tc = useTranslations('categories')
  const locale = useLocale()

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-extrabold text-[#1dbf73]">Jobez</span>
            <p className="mt-2 text-sm text-gray-500">{t('tagline')}</p>
            <p className="mt-4 text-xs text-gray-400">🇵🇰 {t('madeIn')}</p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{t('categories')}</h3>
            <ul className="space-y-2">
              {(['webDev', 'design', 'writing', 'marketing', 'video'] as const).map((key) => (
                <li key={key}>
                  <Link href={`/${locale}/search?category=${key}`}
                    className="text-sm text-gray-500 hover:text-[#1dbf73]">{tc(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{t('about')}</h3>
            <ul className="space-y-2">
              {(['about', 'careers', 'press', 'partnerships', 'privacy', 'terms'] as const).map((key) => (
                <li key={key}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-[#1dbf73]">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{t('support')}</h3>
            <ul className="space-y-2">
              {(['helpCenter', 'trust', 'sellerGuide', 'buyerGuide'] as const).map((key) => (
                <li key={key}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-[#1dbf73]">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Jobez. {t('allRights')}.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>🔒 Secure Payments</span>
            <span>🛡️ CNIC Verified Sellers</span>
            <span>💰 PKR Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
