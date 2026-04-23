'use client'
import { useState, useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Send, Paperclip } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  createdAt: string
}

interface ChatWindowProps {
  orderId: string
  currentUserId: string
  currentUserName: string
  otherUserId: string
  otherUserName: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', senderId: 'u1', senderName: 'Ahmed Raza', content: 'Hello! I have received your order. Please share any additional details about your brand.', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', senderId: 'current', senderName: 'You', content: 'Hi! Please use green and white as primary colors. The company name is TechFlow.', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: '3', senderId: 'u1', senderName: 'Ahmed Raza', content: 'Perfect! I will get started right away and deliver the first draft within 24 hours.', createdAt: new Date(Date.now() - 900000).toISOString() },
]

const pusherAvailable =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_PUSHER_KEY &&
  process.env.NEXT_PUBLIC_PUSHER_KEY.trim() !== ''

export function ChatWindow({ orderId, currentUserId, currentUserName, otherUserName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Only connect to Pusher if credentials are available
  useEffect(() => {
    if (!pusherAvailable) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null

    async function setupPusher() {
      const { getPusherClient } = await import('@/lib/pusher-client')
      const pusher = getPusherClient()
      channel = pusher.subscribe(`order-${orderId}`)
      channel.bind('new-message', (data: Message) => {
        setMessages((prev) => [...prev, data])
      })
    }

    setupPusher().catch(() => {})

    return () => {
      channel?.unbind_all()
    }
  }, [orderId])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return

    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, msg])
    setInput('')
    setSending(true)

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, content: msg.content }),
      })
    } catch {
      // Message shown locally even if server call fails
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: '480px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId || msg.senderId === 'current'
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}>
              <Avatar name={msg.senderName} size="sm" />
              <div className={`max-w-xs lg:max-w-sm ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    isMine
                      ? 'rounded-tr-none bg-[#1dbf73] text-white'
                      : 'rounded-tl-none bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400">{timeAgo(msg.createdAt)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {!pusherAvailable && (
        <div className="border-t border-gray-100 bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
          Real-time chat requires Pusher credentials. Messages are shown locally only.
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-gray-200 p-3 flex items-center gap-2">
        <button type="button" className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-[#1dbf73] focus:outline-none focus:ring-1 focus:ring-[#1dbf73]"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-full bg-[#1dbf73] p-2.5 text-white transition-colors hover:bg-[#19a864] disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
