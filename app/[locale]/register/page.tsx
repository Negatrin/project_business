'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { signIn, getSession } from 'next-auth/react'
import { User, Mail, Lock, AtSign, Eye, EyeOff, CreditCard } from 'lucide-react'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', cnic: '', role: 'buyer' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Registration failed')
      setLoading(false)
      return
    }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    const session = await getSession()
    const role = (session?.user as { role?: string })?.role
    if (role === 'seller' || role === 'both' || role === 'admin') {
      router.push(`/${locale}/seller/dashboard`)
    } else {
      router.push(`/${locale}/dashboard`)
    }
    router.refresh()
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-3xl font-extrabold text-[#1dbf73]">Jobez</Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{t('registerTitle')}</h1>
          <p className="mt-1 text-gray-500">{t('registerSubtitle')}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t('fullName')} type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required icon={<User className="h-4 w-4" />} />
            <Input label={t('username')} type="text" value={form.username} onChange={(e) => update('username', e.target.value.toLowerCase().replace(/\s/g, ''))} required icon={<AtSign className="h-4 w-4" />} />
            <Input label={t('email')} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required icon={<Mail className="h-4 w-4" />} />

            <div className="relative">
              <Input label={t('password')} type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} required icon={<Lock className="h-4 w-4" />} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute end-3 bottom-2.5 text-gray-400">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input label={t('confirmPassword')} type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required icon={<Lock className="h-4 w-4" />} />

            <Input
              label="CNIC Number (e.g. 42101-1234567-1)"
              type="text"
              value={form.cnic}
              onChange={(e) => update('cnic', e.target.value.replace(/[^0-9-]/g, ''))}
              placeholder="XXXXX-XXXXXXX-X"
              icon={<CreditCard className="h-4 w-4" />}
            />

            {/* Role selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">{t('role')}</label>
              <div className="grid grid-cols-3 gap-2">
                {(['buyer', 'seller', 'both'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => update('role', r)}
                    className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${form.role === r ? 'border-[#1dbf73] bg-[#1dbf73]/10 text-[#1dbf73]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {t(r)}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {t('register')}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">{t('agreeToTerms')}</p>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          {t('haveAccount')}{' '}
          <Link href={`/${locale}/login`} className="font-semibold text-[#1dbf73] hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
