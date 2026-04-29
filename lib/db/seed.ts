import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { db } from './index'
import { users, gigs, wallets } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  const hash = await bcrypt.hash('password123', 12)

  // ── Demo accounts ────────────────────────────────────────────────────────────

  const [hassam] = await db.insert(users).values({
    name: 'Muhammad Hassam',
    username: 'muhammadhassan',
    email: 'hassam@jobez.pk',
    passwordHash: hash,
    role: 'seller',
    cnicVerified: true,
    cnicNumber: '42101-1234567-1',
    bio: 'Digital marketing specialist with 5+ years of experience in SEO, social media, and paid advertising. Helping Pakistani businesses grow online.',
    skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Social Media Marketing', 'Content Strategy'],
  }).returning({ id: users.id }).onConflictDoNothing()

  const [munazah] = await db.insert(users).values({
    name: 'Munazah',
    username: 'munazah',
    email: 'munazah@jobez.pk',
    passwordHash: hash,
    role: 'seller',
    cnicVerified: true,
    cnicNumber: '42201-7654321-2',
    bio: 'Professional content writer specializing in Urdu and English. I craft compelling blog posts, product descriptions, and social media content.',
    skills: ['Content Writing', 'Urdu Writing', 'Copywriting', 'Blog Posts', 'Proofreading'],
  }).returning({ id: users.id }).onConflictDoNothing()

  const [junaid] = await db.insert(users).values({
    name: 'Junaid Ansari',
    username: 'junaidansari',
    email: 'junaid@jobez.pk',
    passwordHash: hash,
    role: 'buyer',
    cnicNumber: '42301-9876543-3',
    bio: 'Entrepreneur and business owner looking for reliable freelancers for digital marketing and content needs.',
  }).returning({ id: users.id }).onConflictDoNothing()

  // Legacy demo accounts
  const [buyer] = await db.insert(users).values({
    name: 'Demo User',
    username: 'demouser',
    email: 'demo@jobez.pk',
    passwordHash: hash,
    role: 'both',
  }).returning({ id: users.id }).onConflictDoNothing()

  const [ahmedraza] = await db.insert(users).values({
    name: 'Ahmed Raza',
    username: 'ahmedraza',
    email: 'ahmed@jobez.pk',
    passwordHash: hash,
    role: 'seller',
    cnicVerified: true,
    bio: 'Senior graphic designer with 8+ years of experience.',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator'],
  }).returning({ id: users.id }).onConflictDoNothing()

  const [sarakhan] = await db.insert(users).values({
    name: 'Sara Khan',
    username: 'sarakhan',
    email: 'sara@jobez.pk',
    passwordHash: hash,
    role: 'seller',
    cnicVerified: true,
    bio: 'Full-stack developer specializing in Next.js.',
    skills: ['Next.js', 'React', 'TypeScript'],
  }).returning({ id: users.id }).onConflictDoNothing()

  // ── Wallets ──────────────────────────────────────────────────────────────────

  for (const u of [hassam, munazah, junaid, buyer, ahmedraza, sarakhan]) {
    if (u?.id) await db.insert(wallets).values({ userId: u.id }).onConflictDoNothing()
  }

  // ── Gigs: Muhammad Hassam (digital marketing) ────────────────────────────────

  if (hassam?.id) {
    await db.insert(gigs).values({
      sellerId: hassam.id,
      title: 'I will manage your social media and grow your brand online',
      description: 'Get a complete social media management service including content creation, scheduling, engagement, and monthly analytics reports. I specialize in Facebook, Instagram, and LinkedIn for Pakistani businesses.',
      category: 'marketing',
      tags: ['social media', 'facebook', 'instagram', 'marketing'],
      tier1Title: 'Starter', tier1Desc: '10 posts/month, 2 platforms', tier1Price: 5000, tier1DeliveryDays: 30, tier1Revisions: 2,
      tier2Title: 'Growth', tier2Desc: '20 posts/month, 3 platforms + story', tier2Price: 10000, tier2DeliveryDays: 30, tier2Revisions: 5,
      tier3Title: 'Pro', tier3Desc: 'Unlimited posts, 5 platforms, paid ads management', tier3Price: 20000, tier3DeliveryDays: 30, tier3Revisions: -1,
      isSponsored: true,
      totalOrders: 215,
      avgRating: '4.8',
      totalReviews: 89,
    }).onConflictDoNothing()

    await db.insert(gigs).values({
      sellerId: hassam.id,
      title: 'I will run Google Ads and Facebook Ads campaigns for your business',
      description: 'Professionally managed PPC campaigns with keyword research, ad copywriting, A/B testing, and weekly performance reports. ROI-focused approach for maximum results with your budget.',
      category: 'marketing',
      tags: ['google ads', 'facebook ads', 'ppc', 'paid advertising'],
      tier1Title: 'Basic', tier1Desc: 'Campaign setup + 1 week management', tier1Price: 8000, tier1DeliveryDays: 7, tier1Revisions: 2,
      tier2Title: 'Standard', tier2Desc: 'Full campaign + 1 month management', tier2Price: 18000, tier2DeliveryDays: 30, tier2Revisions: 3,
      tier3Title: 'Premium', tier3Desc: 'Multi-platform ads + strategy + monthly reporting', tier3Price: 35000, tier3DeliveryDays: 30, tier3Revisions: -1,
      isSponsored: false,
      totalOrders: 143,
      avgRating: '4.9',
      totalReviews: 61,
    }).onConflictDoNothing()
  }

  // ── Gigs: Munazah (content writing) ─────────────────────────────────────────

  if (munazah?.id) {
    await db.insert(gigs).values({
      sellerId: munazah.id,
      title: 'I will write SEO-optimized blog posts and articles in Urdu and English',
      description: 'High-quality, plagiarism-free blog posts and articles tailored to your audience. I write in both Urdu and English with proper keyword placement and engaging tone to boost your website traffic.',
      category: 'writing',
      tags: ['blog post', 'article', 'urdu writing', 'seo content'],
      tier1Title: 'Basic', tier1Desc: '500-word article, 1 topic', tier1Price: 1500, tier1DeliveryDays: 2, tier1Revisions: 2,
      tier2Title: 'Standard', tier2Desc: '1000-word article, keyword research included', tier2Price: 3000, tier2DeliveryDays: 3, tier2Revisions: 3,
      tier3Title: 'Premium', tier3Desc: '2000+ words, SEO-optimized, meta tags + image suggestions', tier3Price: 5500, tier3DeliveryDays: 5, tier3Revisions: -1,
      isSponsored: false,
      totalOrders: 178,
      avgRating: '5.0',
      totalReviews: 74,
    }).onConflictDoNothing()

    await db.insert(gigs).values({
      sellerId: munazah.id,
      title: 'I will write compelling product descriptions and website copy',
      description: 'Persuasive, conversion-focused product descriptions and website copy that connects with your customers. Whether you run an e-commerce store or a service business, I will make your words sell.',
      category: 'writing',
      tags: ['product description', 'copywriting', 'website copy', 'ecommerce'],
      tier1Title: 'Starter', tier1Desc: '5 product descriptions (100 words each)', tier1Price: 2000, tier1DeliveryDays: 2, tier1Revisions: 2,
      tier2Title: 'Business', tier2Desc: '15 product descriptions or 1 page website copy', tier2Price: 5000, tier2DeliveryDays: 4, tier2Revisions: 3,
      tier3Title: 'Enterprise', tier3Desc: 'Full website copy (up to 5 pages) + product catalogue', tier3Price: 12000, tier3DeliveryDays: 7, tier3Revisions: -1,
      isSponsored: false,
      totalOrders: 95,
      avgRating: '4.9',
      totalReviews: 42,
    }).onConflictDoNothing()
  }

  // ── Legacy gigs ──────────────────────────────────────────────────────────────

  if (ahmedraza?.id) {
    await db.insert(gigs).values({
      sellerId: ahmedraza.id,
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

  if (sarakhan?.id) {
    await db.insert(gigs).values({
      sellerId: sarakhan.id,
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
