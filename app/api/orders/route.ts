import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, gigs, wallets, transactions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { calculateCommission, DEFAULT_COMMISSION_RATE } from '@/lib/commission'
import { z } from 'zod'
import { addDays } from 'date-fns'

const schema = z.object({
  gigId: z.string().uuid(),
  tier: z.number().int().min(1).max(3),
  requirements: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { gigId, tier, requirements } = parsed.data

  const [gig] = await db.select().from(gigs).where(eq(gigs.id, gigId)).limit(1)
  if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
  if (gig.sellerId === session.user.id) return NextResponse.json({ error: 'Cannot order your own gig' }, { status: 400 })

  const priceMap = { 1: gig.tier1Price, 2: gig.tier2Price, 3: gig.tier3Price }
  const daysMap = { 1: gig.tier1DeliveryDays, 2: gig.tier2DeliveryDays, 3: gig.tier3DeliveryDays }
  const titleMap = { 1: gig.tier1Title, 2: gig.tier2Title, 3: gig.tier3Title }

  const grossAmount = priceMap[tier as 1 | 2 | 3]
  const deliveryDays = daysMap[tier as 1 | 2 | 3]
  const packageTitle = titleMap[tier as 1 | 2 | 3]

  const { commissionAmount, netAmount } = calculateCommission(grossAmount)

  const [order] = await db.insert(orders).values({
    gigId,
    buyerId: session.user.id,
    sellerId: gig.sellerId,
    tier,
    packageTitle,
    grossAmount,
    commissionRate: String(DEFAULT_COMMISSION_RATE),
    commissionAmount,
    netAmount,
    deliveryDays,
    requirements,
    dueDate: addDays(new Date(), deliveryDays),
    status: 'pending',
  }).returning()

  // Add pending balance to seller wallet (deducted on completion)
  await db
    .update(wallets)
    .set({ pendingBalance: netAmount })
    .where(eq(wallets.userId, gig.sellerId))

  return NextResponse.json({ orderId: order.id })
}
