import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

interface ProfileData {
  user: { name?: string | null; email?: string | null; image?: string | null }
  streak: number
  totalSessions: number
  personalBestScore: number
  averageAccuracy: number
  averageTime: number
  recentSessions: Array<{
    id: string
    score: number
    accuracy: number
    timeTaken: number
    timestamp: number
    date: string
  }>
}

export default function Profile() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/'
      return
    }
    if (status === 'authenticated') {
      fetch('/api/profile')
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load')
          return r.json()
        })
        .then(setProfile)
        .catch(() => setError('Failed to load profile'))
        .finally(() => setLoading(false))
    }
  }, [status])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Head>
          <title>Profile - Design Gym</title>
        </Head>
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500">Loading your profile...</p>
        </main>
      </>
    )
  }

  if (error || !profile) {
    return (
      <>
        <Head>
          <title>Profile - Design Gym</title>
        </Head>
        <main className="min-h-screen bg-white px-6 py-12 flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-6">{error || 'Could not load profile'}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white font-medium rounded-[8px] hover:bg-gray-800"
          >
            Back to Home
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Profile - Design Gym</title>
        <meta name="description" content="Your Design Gym profile and activity" />
      </Head>
      <main className="min-h-screen bg-white px-6 py-12 md:px-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header with user info */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 overflow-hidden flex-shrink-0">
              {profile.user.image ? (
                <img src={profile.user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-normal text-black">
                {profile.user.name || 'Designer'}
              </h1>
              <p className="text-sm text-gray-500">Your activity and progress</p>
            </div>
          </div>

          {/* Streak - prominent */}
          <div className="mb-8 p-6 rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <p className="text-sm font-medium text-amber-800 mb-1">Current streak</p>
            <p className="text-3xl font-bold text-amber-900">
              {profile.streak} {profile.streak === 1 ? 'day' : 'days'}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Consecutive days of practice
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="p-4 rounded-[16px] bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Sessions</p>
              <p className="text-xl font-semibold text-black">{profile.totalSessions}</p>
            </div>
            <div className="p-4 rounded-[16px] bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Best score</p>
              <p className="text-xl font-semibold text-black">{profile.personalBestScore.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-[16px] bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Avg accuracy</p>
              <p className="text-xl font-semibold text-black">{profile.averageAccuracy}%</p>
            </div>
          </div>

          {/* Recent activity */}
          <div className="mb-10">
            <h2 className="text-lg font-medium text-black mb-4">Recent activity</h2>
            {profile.recentSessions.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center border border-dashed border-gray-200 rounded-[16px]">
                No sessions yet. Complete a quiz to see your activity here.
              </p>
            ) : (
              <div className="border border-gray-200 rounded-[2rem] overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {profile.recentSessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{s.score.toLocaleString()} pts</p>
                        <p className="text-xs text-gray-500">{s.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          s.accuracy >= 80 ? 'text-green-600' :
                          s.accuracy >= 50 ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {s.accuracy}% accuracy
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(s.timeTaken)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              href="/quiz"
              className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-[8px] hover:bg-gray-800 text-center transition-colors"
            >
              Start Training
            </Link>
            <Link
              href="/leaderboard"
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-[8px] hover:bg-gray-200 text-center transition-colors"
            >
              View Leaderboard
            </Link>
            <Link
              href="/"
              className="px-6 py-3 text-gray-600 font-medium rounded-[8px] hover:text-gray-900 text-center transition-colors"
            >
              Home
            </Link>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
