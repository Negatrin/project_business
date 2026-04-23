'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/utils'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Pre-filled with sample data — in production this would be fetched from DB
const SAMPLE_GIG = {
  title: 'I will design a professional logo for your business',
  category: 'design',
  description: 'Professional logo design with unlimited revisions. Get a unique, memorable brand identity tailored specifically to your business.',
  tier1Title: 'Basic', tier1Desc: '1 concept, 2 revisions, source file', tier1Price: 2500, tier1Days: 3, tier1Rev: 2,
  tier2Title: 'Standard', tier2Desc: '3 concepts, 5 revisions, all files', tier2Price: 5000, tier2Days: 5, tier2Rev: 5,
  tier3Title: 'Premium', tier3Desc: 'Unlimited concepts, unlimited revisions, brand guide', tier3Price: 10000, tier3Days: 7, tier3Rev: -1,
}

export default function EditGigPage() {
  const params = useParams()
  const locale = params.locale as string
  const gigId = params.id as string
  const router = useRouter()
  const t = useTranslations('createGig')

  const [form, setForm] = useState(SAMPLE_GIG)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  function update(k: string, v: string | number) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSave() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800)) // simulate API call
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const categoryOptions = CATEGORIES.map((c) => ({ value: c.key, label: `${c.icon} ${c.label}` }))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/${locale}/seller/gigs`} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-sm text-gray-500">Gig ID: {gigId}</p>
        </div>
      </div>

      {saved && (
        <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
          ✓ Changes saved successfully!
        </div>
      )}

      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Input
          label={t('gigTitle')}
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
        />
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
          rows={5}
        />
      </div>

      <h2 className="mt-6 mb-3 font-semibold text-gray-900">{t('pricing')}</h2>
      {[
        { key: 'tier1', label: t('basicPackage') },
        { key: 'tier2', label: t('standardPackage') },
        { key: 'tier3', label: t('premiumPackage') },
      ].map(({ key, label }) => (
        <div key={key} className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-800">{label}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('packageTitle')}
              value={(form as Record<string, string | number>)[`${key}Title`] as string}
              onChange={(e) => update(`${key}Title`, e.target.value)}
            />
            <Input
              label="Price (PKR)"
              type="number"
              value={(form as Record<string, string | number>)[`${key}Price`] as number}
              onChange={(e) => update(`${key}Price`, Number(e.target.value))}
            />
          </div>
          <Textarea
            label={t('packageDesc')}
            value={(form as Record<string, string | number>)[`${key}Desc`] as string}
            onChange={(e) => update(`${key}Desc`, e.target.value)}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('deliveryDays')}
              type="number"
              value={(form as Record<string, string | number>)[`${key}Days`] as number}
              onChange={(e) => update(`${key}Days`, Number(e.target.value))}
            />
            <Input
              label={t('revisions')}
              type="number"
              value={(form as Record<string, string | number>)[`${key}Rev`] as number}
              onChange={(e) => update(`${key}Rev`, Number(e.target.value))}
            />
          </div>
        </div>
      ))}

      <div className="mt-6 flex gap-3">
        <Link href={`/${locale}/seller/gigs`} className="flex-1">
          <Button variant="outline" className="w-full">{t('cancel' as Parameters<typeof t>[0])}</Button>
        </Link>
        <Button className="flex-1 flex items-center justify-center gap-2" onClick={handleSave} loading={loading}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
