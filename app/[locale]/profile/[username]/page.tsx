import { getTranslations } from 'next-intl/server'
import { SAMPLE_GIGS } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { GigCard } from '@/components/gigs/GigCard'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Clock, MessageSquare, Calendar, Video } from 'lucide-react'
import Link from 'next/link'

interface ProfilePageProps {
  params: { locale: string; username: string }
}

const SAMPLE_PROFILES: Record<string, { name: string; bio: string; skills: string[]; avatar?: string; cnicVerified: boolean; memberSince: string; responseTime: string; languages: string[]; totalReviews: number; avgRating: number }> = {
  ahmedraza: {
    name: 'Ahmed Raza',
    bio: 'Senior graphic designer with 8+ years of experience. Specialized in brand identity, logo design, and digital illustration. I have worked with 300+ clients across Pakistan and internationally.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Photoshop', 'UI Design'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    cnicVerified: true,
    memberSince: 'Jan 2022',
    responseTime: '2 hours',
    languages: ['Urdu', 'English', 'Punjabi'],
    totalReviews: 127,
    avgRating: 4.9,
  },
  sarakhan: {
    name: 'Sara Khan',
    bio: 'Full-stack developer specializing in Next.js, React, and Node.js. Building fast, scalable web applications for Pakistani businesses and startups.',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c3d8?w=200&h=200&fit=crop',
    cnicVerified: true,
    memberSince: 'Mar 2021',
    responseTime: '1 hour',
    languages: ['Urdu', 'English'],
    totalReviews: 89,
    avgRating: 5.0,
  },
}

export default async function ProfilePage({ params: { locale, username } }: ProfilePageProps) {
  const t = await getTranslations('profile')
  const tg = await getTranslations('gig')
  const tc = await getTranslations('common')

  const profile = SAMPLE_PROFILES[username]
  const sellerGigs = SAMPLE_GIGS.filter((g) => g.sellerUsername === username)

  if (!profile) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">👤</p>
          <h2 className="text-xl font-bold text-gray-900">Profile Not Found</h2>
          <p className="text-gray-500 mt-2">This user does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">

        {/* Left: Profile card */}
        <div className="w-full lg:w-72 xl:w-80">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar src={profile.avatar} name={profile.name} size="xl" />
                {profile.cnicVerified && (
                  <div className="absolute -bottom-1 -end-1 rounded-full bg-white p-0.5 shadow">
                    <ShieldCheck className="h-5 w-5 text-[#1dbf73]" />
                  </div>
                )}
              </div>
            </div>

            <h1 className="mt-4 text-xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-sm text-gray-500">@{username}</p>

            {profile.cnicVerified && (
              <div className="mt-2 flex justify-center">
                <Badge variant="green">
                  <ShieldCheck className="me-1 h-3 w-3" />
                  {t('verifiedCNIC')}
                </Badge>
              </div>
            )}

            <div className="mt-4">
              <StarRating rating={profile.avgRating} count={profile.totalReviews} className="justify-center" />
            </div>

            <div className="mt-5 grid grid-cols-2 divide-x divide-gray-100 rounded-lg border border-gray-100">
              <div className="p-3">
                <p className="text-xl font-bold text-gray-900">{profile.totalReviews}</p>
                <p className="text-xs text-gray-500">{t('totalReviews')}</p>
              </div>
              <div className="p-3">
                <p className="text-xl font-bold text-gray-900">{sellerGigs.length}</p>
                <p className="text-xs text-gray-500">{t('activeGigs')}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-start">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{t('responseTime')}: <strong>{profile.responseTime}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{t('memberSince')} <strong>{profile.memberSince}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span>{profile.languages.join(', ')}</span>
              </div>
            </div>

            <Link href={`/${locale}/inbox`} className="mt-5 block">
              <Button className="w-full">{t('contactMe')}</Button>
            </Link>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1">
          {/* Bio */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">About Me</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Skills */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">{t('skills')}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span key={s} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Video intro placeholder */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Video className="h-5 w-5 text-[#1dbf73]" />
              Video Introduction
            </h2>
            <div className="mt-3 aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Video className="mx-auto h-10 w-10 mb-2" />
                <p className="text-sm">Video intro coming soon</p>
              </div>
            </div>
          </div>

          {/* Gigs */}
          {sellerGigs.length > 0 && (
            <div className="mt-5">
              <h2 className="mb-4 text-lg font-bold text-gray-900">{t('activeGigs')}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sellerGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    locale={locale}
                    sponsored={tg('sponsored')}
                    startingAt={tg('startingAt')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
