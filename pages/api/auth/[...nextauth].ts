import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { query } from '../../../lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      const userId = user.id ?? user.email
      try {
        await query(
          `INSERT INTO users (id, email, name, image)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             image = EXCLUDED.image,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, user.email, user.name || user.email.split('@')[0], user.image]
        )
      } catch (err) {
        console.error('Error upserting user:', err)
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub || undefined
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
