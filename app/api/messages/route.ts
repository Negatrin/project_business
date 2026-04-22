import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { messages, orders } from '@/lib/db/schema'
import { pusherServer } from '@/lib/pusher'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  orderId: z.string().uuid(),
  content: z.string().min(1).max(2000),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { orderId, content } = parsed.data

  // Verify user is part of this order
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const isBuyer = order.buyerId === session.user.id
  const isSeller = order.sellerId === session.user.id
  if (!isBuyer && !isSeller) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const receiverId = isBuyer ? order.sellerId : order.buyerId

  const [message] = await db.insert(messages).values({
    orderId,
    senderId: session.user.id,
    receiverId,
    content,
  }).returning()

  // Push via Pusher for real-time
  await pusherServer.trigger(`order-${orderId}`, 'new-message', {
    id: message.id,
    senderId: session.user.id,
    senderName: session.user.name,
    content: message.content,
    createdAt: message.createdAt,
  })

  return NextResponse.json({ ok: true, messageId: message.id })
}
