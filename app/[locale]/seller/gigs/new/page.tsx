'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/utils'
import { ImagePlus, ChevronRight } from 'lucide-react'

export default function CreateGigPage() {
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const t = useTranslations('createGig')

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', category: 'design', description: '',
    tier1Title: 'Basic', tier1Desc: '', tier1Price: 2500, tier1Days: 3, tier1Rev: 1,
    tier2Title: 'Standard', tier2Desc: '', tier2Price: 5000, tier2Days: 5, tier2Rev: 3,
    tier3Title: 'Premium', tier3Desc: '', tier3Price: 10000, tier3Days: 7, tier3Rev: -1,
  })

  function update(k: string, v: string | number) { setForm((f) => ({ ...f, [k]: v })) }

  async function publish() {
    setError('')
    if (form.title.length < 5) { setError('Title must be at least 5 characters.'); return }
    if (form.description.length < 10) { setError('Description must be at least 10 characters.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to publish gig.'); return }
      router.push(`/${locale}/seller/gigs`)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = CATEGORIES.map((c) => ({ value: c.key, label: `${c.icon} ${c.label}` }))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('title')}</h1>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${step >= s ? 'bg-[#1dbf73] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s}
            </div>
            {s < 3 && <div className={`h-0.5 w-12 transition-colors ${step > s ? 'bg-[#1dbf73]' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="ms-2 text-sm text-gray-500">
          {step === 1 ? 'Overview' : step === 2 ? 'Pricing' : 'Publish'}
        </span>
      </div>

      {/* Step 1: Overview */}
      {step === 1 && (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Input label={t('gigTitle')} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder={t('titlePlaceholder')} />
          <Select
            label={t('category')}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            options={categoryOptions}
          />
          <Textarea
            label={t('description')}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder={t('descPlaceholder')}
            rows={6}
          />
          {/* Image upload placeholder */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('images')}</label>
            <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#1dbf73] hover:bg-green-50 transition-colors">
              <ImagePlus className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">{t('uploadImages')}</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
            </div>
          </div>
          <Button className="w-full flex items-center gap-2" onClick={() => setStep(2)} disabled={!form.title || !form.description}>
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Pricing */}
      {step === 2 && (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{t('pricing')}</h2>
          {[
            { key: 'tier1', label: t('basicPackage') },
            { key: 'tier2', label: t('standardPackage') },
            { key: 'tier3', label: t('premiumPackage') },
          ].map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <h3 className="font-semibold text-gray-800">{label}</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('packageTitle')} value={(form as Record<string, string | number>)[`${key}Title`] as string} onChange={(e) => update(`${key}Title`, e.target.value)} />
                <Input label={t('price') + ' (PKR)'} type="number" value={(form as Record<string, string | number>)[`${key}Price`] as number} onChange={(e) => update(`${key}Price`, Number(e.target.value))} />
              </div>
              <Textarea label={t('packageDesc')} value={(form as Record<string, string | number>)[`${key}Desc`] as string} onChange={(e) => update(`${key}Desc`, e.target.value)} rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('deliveryDays')} type="number" value={(form as Record<string, string | number>)[`${key}Days`] as number} onChange={(e) => update(`${key}Days`, Number(e.target.value))} />
                <Input label={t('revisions')} type="number" value={(form as Record<string, string | number>)[`${key}Rev`] as number} onChange={(e) => update(`${key}Rev`, Number(e.target.value))} />
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1 flex items-center gap-2" onClick={() => setStep(3)}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Publish */}
      {step === 3 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-bold text-gray-900">Ready to Publish!</h2>
          <p className="text-gray-500 text-sm">Your gig <strong>"{form.title}"</strong> is ready to go live. It will be visible to thousands of buyers.</p>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setStep(2)} disabled={loading}>Back</Button>
            <Button onClick={publish} loading={loading}>{t('publish')}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
