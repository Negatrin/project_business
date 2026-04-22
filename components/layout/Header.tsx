'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { LocaleToggle } from './LocaleToggle'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface HeaderProps {
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
    role: string
    username: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isSeller = user?.role === 'seller' || user?.role === 'both' || user?.role === 'admin'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0 text-2xl font-extrabold text-[#1dbf73]">
          SensAi
        </Link>

        {/* Search bar — hidden on mobile */}
        <div className="hidden flex-1 max-w-lg md:block">
          <form action={`/${locale}/search`} method="GET" className="relative">
            <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-gray-400" />
            <input
              name="q"
              type="search"
              placeholder={locale === 'ur' ? 'کوئی بھی سروس تلاش کریں...' : 'Search for any service...'}
              className="w-full rounded-full border border-gray-300 py-2 pe-4 ps-10 text-sm focus:border-[#1dbf73] focus:outline-none focus:ring-1 focus:ring-[#1dbf73]"
            />
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleToggle />

          {user ? (
            <>
              {/* Notifications */}
              <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full p-1 hover:bg-gray-100"
                >
                  <Avatar src={user.image} name={user.name} size="sm" />
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute end-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href={`/${locale}/dashboard`} onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t('dashboard')}</Link>
                    <Link href={`/${locale}/orders`} onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t('orders')}</Link>
                    <Link href={`/${locale}/inbox`} onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t('inbox')}</Link>
                    {isSeller && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <Link href={`/${locale}/seller/dashboard`} onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t('sellerDashboard')}</Link>
                        <Link href={`/${locale}/seller/wallet`} onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{t('wallet')}</Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <Link href={`/${locale}/admin`} onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">{t('admin')}</Link>
                      </>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: `/${locale}` }) }}
                      className="block w-full px-4 py-2 text-start text-sm text-red-600 hover:bg-gray-50"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/register`} className="hidden sm:block">
                <Button size="sm">{t('register')}</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search + nav */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-3 md:hidden">
          <form action={`/${locale}/search`} method="GET">
            <input
              name="q"
              type="search"
              placeholder={locale === 'ur' ? 'تلاش کریں...' : 'Search services...'}
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#1dbf73] focus:outline-none"
            />
          </form>
          <div className="mt-3 flex flex-col gap-1">
            <Link href={`/${locale}`} onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">{t('home')}</Link>
            <Link href={`/${locale}/search`} onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">{t('search')}</Link>
            {!user && (
              <Link href={`/${locale}/register`} onClick={() => setMenuOpen(false)}>
                <Button className="w-full mt-2" size="sm">{t('register')}</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
