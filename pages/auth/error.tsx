import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function getErrorTip(error: string, origin: string): string {
  const base = origin || 'https://your-site.vercel.app'
  const callbackUrl = `${base}/api/auth/callback/google`
  const tips: Record<string, string> = {
    Configuration: 'Check that GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, and NEXTAUTH_SECRET are set in Vercel env vars. Redeploy after changes.',
    AccessDenied: 'You may have denied access. Try again in a new tab or incognito window.',
    OAuthCallback: `The redirect URI might be wrong. In Google Console → Credentials → add: ${callbackUrl}`,
    OAuthCreateAccount: 'Could not create account. Run: npm run migrate:auth',
    redirect_uri_mismatch: `In Google Cloud Console → Credentials → Authorized redirect URIs, add exactly: ${callbackUrl} (no trailing slash)`,
    google: `Google OAuth failed. Visit /api/auth/oauth-check and copy the exact values into Google Console. (1) OAuth consent: Publish the app or add your email as a test user. (2) Authorized redirect URIs and JavaScript origins must match exactly.`,
    default: 'See SETUP_AUTH.md in the project for setup steps.',
  }
  return tips[error] || tips.default
}

export default function AuthError() {
  const router = useRouter()
  const error = (router.query.error as string) || 'unknown'
  const [origin, setOrigin] = useState('')
  useEffect(() => setOrigin(typeof window !== 'undefined' ? window.location.origin : ''), [])

  return (
    <>
      <Head>
        <title>Sign-in Error - Design Gym</title>
      </Head>
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-normal text-gray-900 mb-4">
            Sign-in failed
          </h1>
          <p className="text-gray-600 mb-6 text-left">
            {getErrorTip(error, origin)}
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-black text-white font-medium rounded-[8px] hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
            <button
              onClick={() => router.back()}
              className="block w-full px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-[8px] hover:bg-gray-200 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
