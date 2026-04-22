import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

interface PageProps {
  params: { locale: string }
}

const CONVERSATIONS = [
  { id: 'u1', name: 'Ahmed Raza', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', lastMessage: 'I will deliver the first draft within 24 hours.', time: '2h ago', unread: 1, online: true, orderId: 'o1' },
  { id: 'u2', name: 'Sara Khan', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c3d8?w=100&h=100&fit=crop', lastMessage: 'The website is now live! Please check it.', time: '1d ago', unread: 0, online: false, orderId: 'o2' },
  { id: 'u3', name: 'Fatima Malik', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', lastMessage: 'Thank you for the order! I will start now.', time: '3d ago', unread: 2, online: true, orderId: 'o3' },
]

export default async function InboxPage({ params: { locale } }: PageProps) {
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  const t = await getTranslations('inbox')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>

      <div className="flex h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Sidebar */}
        <div className="w-72 border-e border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                placeholder={t('searchMessages')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pe-3 ps-9 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((conv, i) => (
              <a
                key={conv.id}
                href={`/${locale}/orders/${conv.orderId}`}
                className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 ${i === 0 ? 'bg-[#1dbf73]/5 border-s-2 border-s-[#1dbf73]' : ''}`}
              >
                <div className="relative shrink-0">
                  <Avatar src={conv.avatar} name={conv.name} size="md" />
                  {conv.online && (
                    <span className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{conv.name}</p>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1dbf73] text-xs font-bold text-white">
                    {conv.unread}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Placeholder chat area */}
        <div className="flex flex-1 items-center justify-center text-center text-gray-400 p-8">
          <div>
            <div className="text-5xl mb-3">💬</div>
            <p className="font-semibold text-gray-600">Select a conversation</p>
            <p className="text-sm mt-1">Choose from your active orders to chat</p>
          </div>
        </div>
      </div>
    </div>
  )
}
