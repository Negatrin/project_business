import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { gigs, wallets } from '@/lib/db/schema'
import { z } from 'zod'

const createGigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tier1Title: z.string().min(1), tier1Desc: z.string(), tier1Price: z.number().min(1),
  tier1Days: z.number().min(1), tier1Rev: z.number(),
  tier2Title: z.string().min(1), tier2Desc: z.string(), tier2Price: z.number().min(1),
  tier2Days: z.number().min(1), tier2Rev: z.number(),
  tier3Title: z.string().min(1), tier3Desc: z.string(), tier3Price: z.number().min(1),
  tier3Days: z.number().min(1), tier3Rev: z.number(),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createGigSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const d = parsed.data
  const [gig] = await db.insert(gigs).values({
    sellerId: session.user.id,
    title: d.title,
    category: d.category,
    description: d.description,
    tier1Title: d.tier1Title, tier1Desc: d.tier1Desc, tier1Price: d.tier1Price,
    tier1DeliveryDays: d.tier1Days, tier1Revisions: d.tier1Rev,
    tier2Title: d.tier2Title, tier2Desc: d.tier2Desc, tier2Price: d.tier2Price,
    tier2DeliveryDays: d.tier2Days, tier2Revisions: d.tier2Rev,
    tier3Title: d.tier3Title, tier3Desc: d.tier3Desc, tier3Price: d.tier3Price,
    tier3DeliveryDays: d.tier3Days, tier3Revisions: d.tier3Rev,
  }).returning({ id: gigs.id })

  return NextResponse.json({ id: gig.id })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)

  const query = db.select().from(gigs).limit(limit)
  const results = await query
  return NextResponse.json(results)
}
