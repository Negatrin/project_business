import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from './db'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email))
          .limit(1)

        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          username: user.username,
          cnicVerified: user.cnicVerified,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.username = (user as { username?: string }).username
        token.cnicVerified = (user as { cnicVerified?: boolean }).cnicVerified
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.username = token.username as string
        session.user.cnicVerified = token.cnicVerified as boolean
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/en/login',
  },
})

// Augment next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      role: string
      username: string
      cnicVerified: boolean
    }
  }
}
