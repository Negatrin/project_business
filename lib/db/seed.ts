import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { db } from './index'
import { users, gigs, wallets } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  const hash = await bcrypt.hash('password123', 12)

  // Seed users
  const [buyer] = await db.insert(users).values({
    name: 'Demo User',
    username: 'demouser',
    email: 'demo@sensai.pk',
    passwordHash: hash,
    role: 'both',
  }).returning({ id: users.id }).onConflictDoNothing()

  const [seller1] = await db.insert(users).values({
    name: 'Ahmed Raza',
    username: 'ahmedraza',
    email: 'ahmed@sensai.pk',
    passwordHash: hash,
    role: 'seller',
    cnicVerified: true,
    bio: 'Senior graphic designer with 8+ years of experience.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator'],
  }).returning({ id: users.id }).onConflictDoNothing()

  const [seller2] = await db.insert(users).values({
    name: 'Sara Khan',
    username: 'sarakhan',
    email: 'sara@sensai.pk',
    passwordHash: hash,
    role: 'seller',
    cnicVerified: true,
    bio: 'Full-stack developer specializing in Next.js.',
    skills: ['Next.js', 'React', 'TypeScript'],
  }).returning({ id: users.id }).onConflictDoNothing()

  // Create wallets
  if (buyer?.id) await db.insert(wallets).values({ userId: buyer.id }).onConflictDoNothing()
  if (seller1?.id) await db.insert(wallets).values({ userId: seller1.id }).onConflictDoNothing()
  if (seller2?.id) await db.insert(wallets).values({ userId: seller2.id }).onConflictDoNothing()

  // Seed gigs
  if (seller1?.id) {
    await db.insert(gigs).values({
      sellerId: seller1.id,
      title: 'I will design a professional logo for your business',
      description: 'Professional logo design with unlimited revisions. Get a unique, memorable brand identity.',
      category: 'design',
      tags: ['logo', 'brand', 'design'],
      tier1Title: 'Basic', tier1Desc: '1 concept, 2 revisions, source file', tier1Price: 2500, tier1DeliveryDays: 3, tier1Revisions: 2,
      tier2Title: 'Standard', tier2Desc: '3 concepts, 5 revisions, all files', tier2Price: 5000, tier2DeliveryDays: 5, tier2Revisions: 5,
      tier3Title: 'Premium', tier3Desc: 'Unlimited concepts, unlimited revisions, brand guide', tier3Price: 10000, tier3DeliveryDays: 7, tier3Revisions: -1,
      isSponsored: true,
      totalOrders: 342,
      avgRating: '4.9',
      totalReviews: 127,
    }).onConflictDoNothing()
  }

  if (seller2?.id) {
    await db.insert(gigs).values({
      sellerId: seller2.id,
      title: 'I will build a responsive Next.js website',
      description: 'Modern, fast, and SEO-optimized websites using Next.js 14, Tailwind CSS, and TypeScript.',
      category: 'webDev',
      tags: ['nextjs', 'react', 'web'],
      tier1Title: 'Basic', tier1Desc: '5-page website, responsive design', tier1Price: 15000, tier1DeliveryDays: 7, tier1Revisions: 2,
      tier2Title: 'Standard', tier2Desc: '10-page website, CMS, contact form', tier2Price: 30000, tier2DeliveryDays: 14, tier2Revisions: 5,
      tier3Title: 'Premium', tier3Desc: 'Full web app, auth, database, deployment', tier3Price: 60000, tier3DeliveryDays: 30, tier3Revisions: -1,
      isSponsored: false,
      totalOrders: 201,
      avgRating: '5.0',
      totalReviews: 89,
    }).onConflictDoNothing()
  }

  console.log('✅ Seed complete!')
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
