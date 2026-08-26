import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'

// Placeholder partner logos
const PARTNER_LOGOS = [
  { name: 'Partner 1', url: 'https://via.placeholder.com/100x40?text=Logo1' },
  { name: 'Partner 2', url: 'https://via.placeholder.com/100x40?text=Logo2' },
  { name: 'Partner 3', url: 'https://via.placeholder.com/100x40?text=Logo3' },
  { name: 'Partner 4', url: 'https://via.placeholder.com/100x40?text=Logo4' },
  { name: 'Partner 5', url: 'https://via.placeholder.com/100x40?text=Logo5' },
]

const MARQUEE_ITEMS = Array.from({ length: 8 }, (_, i) => i)

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [handleIndex, setHandleIndex] = useState(0)
  const [playerHandles, setPlayerHandles] = useState<string[]>([])
  const [loadingHandles, setLoadingHandles] = useState(true)
  const [streak, setStreak] = useState<number | null>(null)

  // Redirect auth errors to the dedicated error page
  useEffect(() => {
    const err = router.query.error as string
    if (err) {
      router.replace(`/auth/error?error=${encodeURIComponent(err)}`, undefined, { shallow: false })
    }
  }, [router.query.error])

  // Fetch streak when signed in
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/streak')
        .then((r) => r.ok ? r.json() : null)
        .then((data) => data && setStreak(data.currentStreak))
        .catch(() => {})
    } else {
      setStreak(null)
    }
  }, [session?.user?.id])

  // Fetch real Twitter handles from database
  useEffect(() => {
    const fetchHandles = async () => {
      try {
        const response = await fetch('/api/twitter-handles')
        if (response.ok) {
          const handles = await response.json()
          // Only use real handles from database, no fallback
          setPlayerHandles(handles)
        } else {
          // No fallback - just empty array
          setPlayerHandles([])
        }
      } catch (error) {
        console.error('Error fetching Twitter handles:', error)
        // No fallback - just empty array
        setPlayerHandles([])
      } finally {
        setLoadingHandles(false)
      }
    }

    fetchHandles()
  }, [])

  // Handle scrolling Twitter handles
  useEffect(() => {
    if (playerHandles.length === 0) return
    
    const interval = setInterval(() => {
      setHandleIndex((prev) => (prev + 1) % playerHandles.length)
    }, 2000) // Change handle every 2 seconds

    return () => clearInterval(interval)
  }, [playerHandles])

  return (
    <>
      <Head>
        <title>Design Gym</title>
        <meta name="description" content="Practice platform where designers train their visual judgment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        className="h-screen overflow-hidden relative"
        style={{
          background: 'linear-gradient(to top, #E8DFD4 0%, #F4EFE8 32%, #FFFFFF 70%)',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
      >
        {/* Rolling "Design Gym" background text */}
        <div
          className="hero-marquee pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="hero-marquee-track">
            <div className="hero-marquee-set">
              {MARQUEE_ITEMS.map((i) => (
                <img
                  key={`a-${i}`}
                  src="/hero-marquee-eurostile.svg"
                  alt=""
                  className="hero-marquee-word"
                />
              ))}
            </div>
            <div className="hero-marquee-set">
              {MARQUEE_ITEMS.map((i) => (
                <img
                  key={`b-${i}`}
                  src="/hero-marquee-eurostile.svg"
                  alt=""
                  className="hero-marquee-word"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Logo - top center */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <Link href="/">
            <img src="/logo-brand.png" alt="Design Gym" className="h-8 md:h-10 w-auto" />
          </Link>
        </div>

        {/* Sign up / user area - top right */}
        <div className="absolute top-6 right-4 md:right-8 lg:right-12 xl:right-16 z-50 flex items-center gap-3">
          {streak !== null && streak > 0 && (
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-[8px]">
              {streak} day streak
            </span>
          )}
          {status === 'authenticated' ? (
            <Link
              href="/profile"
              className="hero-btn hero-btn-secondary hero-btn-sm"
            >
              Your Progress
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/quiz' })}
              className="hero-btn hero-btn-secondary hero-btn-sm"
            >
              Sign up
            </button>
          )}
        </div>

        {/* Hero Section */}
        <section className="h-full px-4 md:px-8 lg:px-12 xl:px-16 relative z-10 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center w-full">
            {/* Centered headline */}
            <div className="flex flex-col items-center mb-5 sm:mb-6 md:mb-7">
              <img
                src="/wordmark.png"
                alt="Design Gym"
                className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto mb-3 md:mb-4"
              />
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 md:mb-8 max-w-xl">
                Sharpen your design eye with quick, side-by-side comparison rounds that train your attention to detail.
              </p>
              <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link
                  href="/quiz"
                  className="hero-btn hero-btn-primary w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Quick Play
                </Link>
                <Link
                  href="/leaderboard"
                  className="hero-btn hero-btn-secondary w-full sm:w-auto"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>

            {/* Central visual — 3D dumbbell */}
            <div className="hero-dumbbell-wrap relative z-10">
              <img
                src="/hero-dumbbell-3d.png?v=3"
                alt=""
                className="hero-dumbbell"
              />
              <div className="hero-dumbbell-shadow" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Social Proof Strip - Bottom Left of Screen */}
        <div className="absolute bottom-0 left-4 md:left-8 lg:left-12 xl:left-16 pb-4 sm:pb-8 md:pb-12 lg:pb-16 z-30">
            <div className="flex flex-col items-start gap-2">
              <div className="w-40 sm:w-56 border-t border-gray-200 mb-2"></div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                110+ designers already training
              </p>
              <div className="relative h-5 w-full max-w-md overflow-hidden">
                {loadingHandles ? (
                  <span className="text-xs text-gray-400 font-normal">Loading...</span>
                ) : playerHandles.length > 0 ? (
                  <div className="absolute inset-0 flex flex-col">
                    {playerHandles.map((handle, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-500 font-normal whitespace-nowrap w-full text-left transition-all duration-500 ease-in-out absolute"
                        style={{
                          transform: `translateY(${(index - handleIndex) * 100}%)`,
                          opacity: Math.abs(index - handleIndex) <= 1 ? 1 : 0,
                        }}
                      >
                        {handle}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-normal">Be the first to connect your Twitter!</span>
                )}
              </div>
            </div>
          </div>

          {/* Credit - Bottom Right with filled frame - Hidden on mobile */}
          <div className="hidden sm:block absolute bottom-0 right-4 md:right-8 lg:right-12 xl:right-16 pb-8 md:pb-12 lg:pb-16 z-30">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-[8px] border border-gray-300/50 shadow-md hover:shadow-lg transition-all duration-200">
              <a href="https://www.quadmor.design" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-800 font-medium tracking-wide">
                <span className="text-gray-500">Vibe coded by</span>{' '}
                <span className="text-black font-semibold hover:underline">Quadri Morin</span>
              </a>
            </div>
          </div>
      </main>
    </>
  )
}
