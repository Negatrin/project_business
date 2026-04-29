'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { getSession } from 'next-auth/react'

export default function LoginPage() {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password')
    } else {
      const session = await getSession()
      const role = (session?.user as { role?: string })?.role
      if (role === 'seller' || role === 'both' || role === 'admin') {
        router.push(`/${locale}/seller/dashboard`)
      } else {
        router.push(`/${locale}/dashboard`)
      }
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-3xl font-extrabold text-[#1dbf73]">Jobez</Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{t('loginTitle')}</h1>
          <p className="mt-1 text-gray-500">{t('loginSubtitle')}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              icon={<Mail className="h-4 w-4" />}
            />
            <div className="relative">
              <Input
                label={t('password')}
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={<Lock className="h-4 w-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute end-3 bottom-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-[#1dbf73]" />
                Remember me
              </label>
              <a href="#" className="text-[#1dbf73] hover:underline">{t('forgotPassword')}</a>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {t('login')}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
            <strong>Demo:</strong> junaid@jobez.pk / password123 (buyer) · hassam@jobez.pk / password123 (seller)
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/register`} className="font-semibold text-[#1dbf73] hover:underline">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
