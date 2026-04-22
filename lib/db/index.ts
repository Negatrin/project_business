import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

let _db: DrizzleDb | null = null

function createDb(): DrizzleDb {
  const sql = neon(process.env.DATABASE_URL!)
  return drizzle(sql, { schema })
}

// Lazy proxy — only calls neon() on first real database access, not at import time.
// This prevents build-time crashes when DATABASE_URL is not available.
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    if (!_db) _db = createDb()
    return (_db as unknown as Record<PropertyKey, unknown>)[prop]
  },
})
