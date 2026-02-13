import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ERROR_TIPS: Record<string, string> = {
  Configuration: 'Check that GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, and NEXTAUTH_SECRET are set in .env.local. Restart the dev server after changes.',
  AccessDenied: 'You may have denied access. Try again in a new tab or incognito window.',
  OAuthCallback: 'The redirect URI might be wrong. In Google Console → Credentials → your OAuth client → add exactly: http://localhost:3000/api/auth/callback/google',
  OAuthCreateAccount: 'Could not create account. Run: npm run migrate:auth',
  redirect_uri_mismatch: 'In Google Cloud Console → Credentials → your OAuth client → Authorized redirect URIs, add exactly: http://localhost:3000/api/auth/callback/google (no trailing slash)',
  default: 'See SETUP_AUTH.md in the project for step-by-step setup.',
}

export default function AuthError() {
  const router = useRouter()
  const error = (router.query.error as string) || 'unknown'

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
          <p className="text-gray-600 mb-6">
            {ERROR_TIPS[error] || ERROR_TIPS.default}
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
