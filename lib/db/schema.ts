import {
  pgTable,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['buyer', 'seller', 'both', 'admin'])
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed',
])
export const gigStatusEnum = pgEnum('gig_status', ['active', 'paused', 'draft', 'deleted'])
export const transactionTypeEnum = pgEnum('transaction_type', ['credit', 'debit', 'withdrawal', 'refund'])
export const adStatusEnum = pgEnum('ad_status', ['active', 'paused', 'expired'])
export const adSlotEnum = pgEnum('ad_slot', ['homepage_hero', 'homepage_featured', 'search_top'])
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected'])

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  role: userRoleEnum('role').default('buyer').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  cnicVerified: boolean('cnic_verified').default(false).notNull(),
  cnicNumber: varchar('cnic_number', { length: 15 }),
  cnicFrontUrl: text('cnic_front_url'),
  cnicBackUrl: text('cnic_back_url'),
  videoIntroUrl: text('video_intro_url'),
  skills: jsonb('skills').$type<string[]>().default([]),
  languages: jsonb('languages').$type<string[]>().default([]),
  responseTimeHours: integer('response_time_hours').default(24),
  totalReviews: integer('total_reviews').default(0),
  avgRating: numeric('avg_rating', { precision: 3, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Gigs ─────────────────────────────────────────────────────────────────────

export const gigs = pgTable('gigs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),

  // Tier 1 — Basic
  tier1Title: varchar('tier1_title', { length: 100 }).notNull().default('Basic'),
  tier1Desc: text('tier1_desc').notNull().default(''),
  tier1Price: integer('tier1_price').notNull(),
  tier1DeliveryDays: integer('tier1_delivery_days').notNull().default(3),
  tier1Revisions: integer('tier1_revisions').notNull().default(1),

  // Tier 2 — Standard
  tier2Title: varchar('tier2_title', { length: 100 }).notNull().default('Standard'),
  tier2Desc: text('tier2_desc').notNull().default(''),
  tier2Price: integer('tier2_price').notNull(),
  tier2DeliveryDays: integer('tier2_delivery_days').notNull().default(5),
  tier2Revisions: integer('tier2_revisions').notNull().default(3),

  // Tier 3 — Premium
  tier3Title: varchar('tier3_title', { length: 100 }).notNull().default('Premium'),
  tier3Desc: text('tier3_desc').notNull().default(''),
  tier3Price: integer('tier3_price').notNull(),
  tier3DeliveryDays: integer('tier3_delivery_days').notNull().default(7),
  tier3Revisions: integer('tier3_revisions').notNull().default(-1), // -1 = unlimited

  totalOrders: integer('total_orders').default(0).notNull(),
  avgRating: numeric('avg_rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0).notNull(),
  isSponsored: boolean('is_sponsored').default(false).notNull(),
  status: gigStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  gigId: uuid('gig_id').references(() => gigs.id).notNull(),
  buyerId: uuid('buyer_id').references(() => users.id).notNull(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  tier: integer('tier').notNull().default(1), // 1, 2, or 3
  packageTitle: varchar('package_title', { length: 100 }).notNull(),
  grossAmount: integer('gross_amount').notNull(), // PKR, in paisas or whole PKR
  commissionRate: numeric('commission_rate', { precision: 5, scale: 2 }).notNull(),
  commissionAmount: integer('commission_amount').notNull(),
  netAmount: integer('net_amount').notNull(), // what seller receives
  serviceFee: integer('service_fee').notNull().default(0), // optional buyer-side fee
  deliveryDays: integer('delivery_days').notNull(),
  requirements: text('requirements'),
  deliveryUrl: text('delivery_url'),
  status: orderStatusEnum('status').default('pending').notNull(),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  content: text('content'),
  fileUrl: text('file_url'),
  fileType: varchar('file_type', { length: 50 }),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Wallets ──────────────────────────────────────────────────────────────────

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  availableBalance: integer('available_balance').default(0).notNull(),
  pendingBalance: integer('pending_balance').default(0).notNull(),
  totalEarned: integer('total_earned').default(0).notNull(),
  totalWithdrawn: integer('total_withdrawn').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orderId: uuid('order_id').references(() => orders.id),
  type: transactionTypeEnum('type').notNull(),
  grossAmount: integer('gross_amount').notNull(),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 2 }).default('0'),
  commissionAmount: integer('commission_amount').default(0).notNull(),
  netAmount: integer('net_amount').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id).notNull().unique(),
  gigId: uuid('gig_id').references(() => gigs.id).notNull(),
  buyerId: uuid('buyer_id').references(() => users.id).notNull(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Sponsored Ads ────────────────────────────────────────────────────────────

export const sponsoredAds = pgTable('sponsored_ads', {
  id: uuid('id').primaryKey().defaultRandom(),
  gigId: uuid('gig_id').references(() => gigs.id, { onDelete: 'cascade' }).notNull(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  slot: adSlotEnum('slot').notNull(),
  bidAmountPerDay: integer('bid_amount_per_day').notNull(),
  totalBudget: integer('total_budget').notNull(),
  totalSpent: integer('total_spent').default(0).notNull(),
  impressions: integer('impressions').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  status: adStatusEnum('status').default('active').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── CNIC Verifications ───────────────────────────────────────────────────────

export const cnicVerifications = pgTable('cnic_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  cnicNumber: varchar('cnic_number', { length: 15 }).notNull(),
  frontImageUrl: text('front_image_url').notNull(),
  backImageUrl: text('back_image_url').notNull(),
  status: verificationStatusEnum('status').default('pending').notNull(),
  adminNote: text('admin_note'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many, one }) => ({
  gigs: many(gigs),
  buyerOrders: many(orders, { relationName: 'buyer' }),
  sellerOrders: many(orders, { relationName: 'seller' }),
  wallet: one(wallets, { fields: [users.id], references: [wallets.userId] }),
  transactions: many(transactions),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  cnicVerification: one(cnicVerifications, { fields: [users.id], references: [cnicVerifications.userId] }),
}))

export const gigsRelations = relations(gigs, ({ one, many }) => ({
  seller: one(users, { fields: [gigs.sellerId], references: [users.id] }),
  orders: many(orders),
  reviews: many(reviews),
  sponsoredAds: many(sponsoredAds),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  gig: one(gigs, { fields: [orders.gigId], references: [gigs.id] }),
  buyer: one(users, { fields: [orders.buyerId], references: [users.id], relationName: 'buyer' }),
  seller: one(users, { fields: [orders.sellerId], references: [users.id], relationName: 'seller' }),
  messages: many(messages),
  review: one(reviews, { fields: [orders.id], references: [reviews.orderId] }),
  transaction: one(transactions, { fields: [orders.id], references: [transactions.orderId] }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Gig = typeof gigs.$inferSelect
export type NewGig = typeof gigs.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type Message = typeof messages.$inferSelect
export type Transaction = typeof transactions.$inferSelect
export type Wallet = typeof wallets.$inferSelect
export type Review = typeof reviews.$inferSelect
export type SponsoredAd = typeof sponsoredAds.$inferSelect
export type CnicVerification = typeof cnicVerifications.$inferSelect
