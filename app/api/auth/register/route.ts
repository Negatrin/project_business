import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, wallets } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['buyer', 'seller', 'both']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, username, email, password, role } = parsed.data

    // Check duplicates
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const existingUsername = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1)
    if (existingUsername.length > 0) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const [user] = await db.insert(users).values({ name, username, email, passwordHash, role }).returning({ id: users.id })

    // Create wallet for the user
    await db.insert(wallets).values({ userId: user.id })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
