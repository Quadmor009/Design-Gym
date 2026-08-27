import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
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
  const [trainingCategory, setTrainingCategory] = useState<'visual' | 'prompt'>('visual')

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
      <main className="hero-surface h-screen overflow-hidden relative">
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

        {status === 'authenticated' && (
          <div className="absolute top-6 right-4 md:right-8 lg:right-12 xl:right-16 z-50 flex items-center gap-3">
            {streak !== null && streak > 0 && (
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-[8px]">
                {streak} day streak
              </span>
            )}
            <Link
              href="/profile"
              className="hero-btn hero-btn-secondary hero-btn-sm"
            >
              Your Progress
            </Link>
          </div>
        )}

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
                Good today, Better tomorrow. No short cuts!
              </p>
              <div
                role="radiogroup"
                aria-label="Reps"
                className="relative mb-4 inline-flex w-full max-w-md rounded-full bg-white p-1"
              >
                <span
                  aria-hidden="true"
                  className="training-toggle-thumb pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-black"
                  style={{
                    transform: trainingCategory === 'prompt' ? 'translateX(100%)' : 'translateX(0)',
                  }}
                />
                {([
                  { id: 'visual', label: 'Visual Reps' },
                  { id: 'prompt', label: 'Prompt Reps' },
                ] as const).map((option) => {
                  const isActive = trainingCategory === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setTrainingCategory(option.id)}
                      className={`training-toggle-option relative z-10 flex-1 rounded-full px-3 py-2.5 text-sm ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <Link
                href={`/quiz?category=${trainingCategory}`}
                className="hero-btn hero-btn-primary w-full sm:w-auto"
              >
                Play
              </Link>
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
            <a
              href="https://www.quadmor.design"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-[8px] border border-gray-300/50 text-xs font-medium tracking-wide cursor-pointer"
            >
              <span className="text-gray-500">built by</span>{' '}
              <span className="text-black font-semibold">Quadmor</span>
            </a>
          </div>
      </main>
    </>
  )
}
