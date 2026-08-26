import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Head from 'next/head'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { questions, foxQuote, Question } from '../data/quizData'

const HOW_IT_WORKS_STEPS = [
  { title: 'Choose', body: 'Pick the better design.' },
  { title: 'Compare', body: 'Review both after answering.' },
  { title: 'Earn', body: 'Correct answers earn 100 coins.' },
] as const

// Configuration for questions per level - never show all questions
const QUESTIONS_PER_LEVEL: Record<'beginner' | 'mid' | 'expert', number> = {
  beginner: 5, // Show 5 out of 20 beginner questions
  mid: 7, // Show 7 out of 20 mid questions
  expert: 8, // Show 8 out of 20 expert questions
}

// Required pool composition - validate that pools meet these requirements
const REQUIRED_POOL_COMPOSITION: Record<'beginner' | 'mid' | 'expert', { image: number; typeface: number }> = {
  beginner: { image: 15, typeface: 5 },
  mid: { image: 12, typeface: 8 },
  expert: { image: 13, typeface: 7 }
}

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Validate that all questions have explicit difficulty fields
function validateQuestions(questions: Question[]): void {
  const missingDifficulty = questions.filter(q => !q.difficulty)
  if (missingDifficulty.length > 0) {
    throw new Error(
      `CRITICAL: ${missingDifficulty.length} question(s) are missing explicit difficulty field. ` +
      `Questions must explicitly define difficulty: "beginner" | "mid" | "expert". ` +
      `Missing difficulty in questions: ${missingDifficulty.map(q => q.id).join(', ')}`
    )
  }
}

// Validate that difficulty pools meet required composition
function validatePoolComposition(
  difficulty: 'beginner' | 'mid' | 'expert',
  imageQuestions: Question[],
  typefaceQuestions: Question[]
): void {
  const required = REQUIRED_POOL_COMPOSITION[difficulty]
  const actualImage = imageQuestions.length
  const actualTypeface = typefaceQuestions.length
  
  if (actualImage !== required.image || actualTypeface !== required.typeface) {
    throw new Error(
      `CRITICAL: ${difficulty} difficulty pool does not meet required composition. ` +
      `Required: ${required.image} image, ${required.typeface} typeface. ` +
      `Actual: ${actualImage} image, ${actualTypeface} typeface. ` +
      `Difficulty must be explicitly defined in question data - do not infer from filenames, IDs, or indexes.`
    )
  }
}

// Select and randomize questions from all levels
// STRICT RULES: Filter by explicit difficulty field only - never infer from filenames, IDs, or indexes
function getRandomizedQuestions(): Question[] {
  // First, validate all questions have explicit difficulty
  validateQuestions(questions)
  
  const selectedQuestions: Question[] = []
  
  // Process each level in order: beginner, mid, expert
  for (const level of ['beginner', 'mid', 'expert'] as const) {
    // STEP 1: Filter questions by explicit difficulty field ONLY
    // This is the ONLY source of truth - do NOT infer from filenames, IDs, or indexes
    const levelQuestions = questions.filter(q => {
      if (!q.difficulty) {
        throw new Error(
          `CRITICAL: Question ${q.id} is missing explicit difficulty field. ` +
          `Every question must explicitly define difficulty: "beginner" | "mid" | "expert"`
        )
      }
      return q.difficulty === level
    })
    
    // STEP 2: Split by type within this difficulty pool
    const imageQuestions = levelQuestions.filter(q => q.type === 'image')
    const typefaceQuestions = levelQuestions.filter(q => q.type === 'typeface')
    
    // STEP 3: Validate pool composition matches requirements
    validatePoolComposition(level, imageQuestions, typefaceQuestions)
    
    // STEP 4: Shuffle within each type pool
    const shuffledImage = shuffleArray(imageQuestions)
    const shuffledTypeface = shuffleArray(typefaceQuestions)
    
    // STEP 5: Select required number from this difficulty level
    // (Selection is random - doesn't need to maintain image/typeface ratio)
    const allShuffled = shuffleArray([...shuffledImage, ...shuffledTypeface])
    const count = QUESTIONS_PER_LEVEL[level]
    
    if (allShuffled.length < count) {
      throw new Error(
        `CRITICAL: ${level} difficulty pool has only ${allShuffled.length} questions, ` +
        `but ${count} are required for selection.`
      )
    }
    
    const selected = allShuffled.slice(0, count)
    selectedQuestions.push(...selected)
  }
  
  // STEP 6: Return questions in level order (beginner, mid, expert)
  // Each level is shuffled within itself, but levels remain in order
  return selectedQuestions
}

// Shuffle answer options at render time
// Returns shuffled options with the correct answer position tracked
// Since optionA is always correct (from "-a" variant), we track where it ends up
function shuffleOptions(optionA: string, optionB: string, correctOption: "A") {
  const options = [
    { value: optionA, isCorrect: true },
    { value: optionB, isCorrect: false }
  ]
  const shuffled = shuffleArray(options)
  
  // Determine which position (left or right) has the correct answer
  const leftIsCorrect = shuffled[0].isCorrect
  const correctAnswer = leftIsCorrect ? 'left' : 'right'
  
  return {
    leftOption: shuffled[0].value,
    rightOption: shuffled[1].value,
    correctAnswer: correctAnswer
  }
}

export default function QuizContent() {
  // Initialize randomized questions only once using function initializer
  // This prevents reshuffling on re-render
  const [sessionQuestions] = useState<Question[]>(() => getRandomizedQuestions())
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'left' | 'right' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false)
  const [completedLevel, setCompletedLevel] = useState<'beginner' | 'mid' | 'expert' | null>(null)
  const [showInstructionModal, setShowInstructionModal] = useState(true)
  const [instructionStep, setInstructionStep] = useState(0)
  const [isQuickPlay, setIsQuickPlay] = useState(false)
  const [quickPlaySaved, setQuickPlaySaved] = useState(false)
  const [quickPlaySignUpDismissed, setQuickPlaySignUpDismissed] = useState(false)
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false)
  
  // Coin state - track coins silently during session
  const [coins, setCoins] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [isCoinAnimating, setIsCoinAnimating] = useState(false)
  
  // Time tracking
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  
  // Player name
  const [playerName, setPlayerName] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [submittingLeaderboard, setSubmittingLeaderboard] = useState(false)
  
  // Share tone toggle
  const [shareTone, setShareTone] = useState<'brag' | 'humble'>('brag')
  const { data: session, status } = useSession()

  // Enable scrolling on quiz page
  useEffect(() => {
    document.body.classList.add('quiz-page')
    return () => {
      document.body.classList.remove('quiz-page')
    }
  }, [])

  // Warn user before leaving mid-session (forfeit progress)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (startTime && !completedLevel) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [startTime, completedLevel])

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentQuestionIndex])

  const currentQuestion = sessionQuestions[currentQuestionIndex]
  
  // Shuffle options at render time for each question
  // This ensures options are randomly positioned each time
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return null
    return shuffleOptions(
      currentQuestion.optionA,
      currentQuestion.optionB,
      currentQuestion.correctOption
    )
  }, [currentQuestion])

  // Check if we're at the last question
  const isLastQuestion = currentQuestionIndex === sessionQuestions.length - 1

  const handleSelect = (side: 'left' | 'right') => {
    if (!showExplanation && currentQuestion && shuffledOptions) {
      setSelectedAnswer(side)
      setShowExplanation(true)
      
      // Determine if the selected answer is correct
      // The correct answer position is tracked in shuffledOptions.correctAnswer
      const isCorrect = side === shuffledOptions.correctAnswer
      
      // Track coins silently - add 100 coins for correct answer (only once per question)
      if (isCorrect && !answeredQuestions.has(currentQuestionIndex)) {
        setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex))
        setCoins(prevCoins => prevCoins + 100)
        // Trigger coin bounce animation
        setIsCoinAnimating(true)
        // Remove animation class after animation completes (400ms)
        setTimeout(() => {
          setIsCoinAnimating(false)
        }, 400)
      } else if (!isCorrect && !answeredQuestions.has(currentQuestionIndex)) {
        // Mark question as answered even if incorrect (to prevent double counting)
        setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex))
      }
      
      // If this is the last question, automatically show the completion modal
      if (isLastQuestion) {
        setTimeout(() => {
          setCompletedLevel('expert')
          // Don't set endTime here - let the submission useEffect handle it
          setShowLevelCompleteModal(true)
        }, 500) // Small delay to show the explanation first
      }
    }
  }

  const handleNext = () => {
    // Check if we just completed question 5 (beginner level complete)
    // After answering question 5 (index 4), clicking Next should show modal
    if (currentQuestionIndex === 4) {
      setCompletedLevel('beginner')
      setShowLevelCompleteModal(true)
      return
    }
    
    // Check if we just completed question 12 (mid level complete)
    // After answering question 12 (index 11), clicking Next should show modal
    if (currentQuestionIndex === 11) {
      setCompletedLevel('mid')
      setShowLevelCompleteModal(true)
      return
    }
    
    // Check if we just completed the last question (expert level complete)
    if (isLastQuestion) {
      setCompletedLevel('expert')
      // Don't set endTime here - let the submission useEffect handle it
      setShowLevelCompleteModal(true)
      return
    }
    
    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  // Calculate max coins and accuracy
  const totalQuestions = sessionQuestions.length
  const maxCoins = totalQuestions * 100
  const accuracy = totalQuestions > 0 ? Math.round((coins / maxCoins) * 100) : 0

  const handleProceedToNextLevel = () => {
    setShowLevelCompleteModal(false)
    setCompletedLevel(null)
    
    if (isLastQuestion) {
      // Reset session completely if we completed the entire session
      setCurrentQuestionIndex(0)
      setCoins(0)
      setAnsweredQuestions(new Set())
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleStartOver = () => {
    setShowLevelCompleteModal(false)
    setCompletedLevel(null)
    setCurrentQuestionIndex(0)
    setCoins(0)
    setAnsweredQuestions(new Set())
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleStartTraining = () => {
    setShowInstructionModal(false)
    setPlayerName(session?.user?.name || session?.user?.email?.split('@')[0] || 'Player')
    setStartTime(Date.now())
  }

  const handleQuickPlay = () => {
    setIsQuickPlay(true)
    setShowInstructionModal(false)
    setStartTime(Date.now())
  }

  // Set endTime for quick play when completion modal shows
  useEffect(() => {
    if (isQuickPlay && showLevelCompleteModal && completedLevel === 'expert' && !endTime) {
      setEndTime(Date.now())
    }
  }, [isQuickPlay, showLevelCompleteModal, completedLevel, endTime])

  // Record streak when quiz completes (signed-in users only)
  useEffect(() => {
    if (completedLevel === 'expert' && session?.user?.id) {
      fetch('/api/streak', { method: 'POST' }).catch(() => {})
    }
  }, [completedLevel, session?.user?.id])

  // Auto-submit to leaderboard when session completes
  useEffect(() => {
    console.log('Submission check:', { 
      completedLevel, 
      startTime: !!startTime, 
      playerName: playerName.trim(), 
      endTime: !!endTime,
      coins,
      accuracy 
    })
    
    if (completedLevel === 'expert' && startTime && playerName.trim() && !endTime) {
      console.log('✅ Conditions met - submitting to leaderboard')
      const finalEndTime = Date.now()
      setEndTime(finalEndTime)
      
      // Submit to leaderboard
      const submitEntry = async () => {
        setSubmittingLeaderboard(true)
        try {
          const timeTaken = Math.floor((finalEndTime - startTime) / 1000)
          const level = 'all'
          
          const submissionData = {
            name: playerName.trim(),
            score: coins,
            accuracy: accuracy,
            timeTaken: timeTaken,
            level: level,
            twitterHandle: twitterHandle.trim() || null,
          }
          
          console.log('📤 Submitting to leaderboard:', submissionData)
          
          const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(submissionData),
          })
          
          if (response.ok) {
            const entry = await response.json()
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('lastLeaderboardEntryId', entry.id)
            }
            console.log('✅ Successfully submitted to leaderboard:', entry)
            // Don't show alert on success - it's annoying
          } else {
            // Get error message from response
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            console.error('❌ Failed to submit to leaderboard:', response.status, errorData)
            // Only show alert for actual errors, not network timeouts
            if (response.status >= 500) {
              alert(`Server error saving score. Please check the leaderboard - it may have been saved.`)
            } else {
              alert(`Failed to save score: ${errorData.error || errorData.message || 'Unknown error'}`)
            }
          }
        } catch (error) {
          console.error('⚠️ Error submitting to leaderboard:', error)
          // "Failed to fetch" usually means network issue, but request might have succeeded
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          
          // Check for various network error patterns
          const isNetworkError = 
            errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('NetworkError') ||
            errorMessage.includes('network') ||
            errorMessage.includes('timeout') ||
            errorMessage.includes('aborted')
          
          if (isNetworkError) {
            // Network error - request might have actually succeeded
            // Check if score appears on leaderboard instead of showing error
            console.log('⚠️ Network error detected, but request may have succeeded. Check leaderboard to confirm.')
            // Don't show alert - let user check leaderboard themselves
            // The score was likely saved successfully despite the network error
          } else {
            // Other errors - show alert
            alert(`Error saving score: ${errorMessage}`)
          }
        } finally {
          setSubmittingLeaderboard(false)
        }
      }
      
      submitEntry()
    }
  }, [completedLevel, startTime, playerName, coins, accuracy, endTime])

  const handleViewLeaderboard = () => {
    window.location.href = '/leaderboard'
  }

  const handleQuickPlaySaveToLeaderboard = async () => {
    if (!playerName.trim() || !startTime) return
    setSubmittingLeaderboard(true)
    try {
      const timeTaken = endTime ? Math.floor((endTime - startTime) / 1000) : Math.floor((Date.now() - startTime) / 1000)
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: playerName.trim(),
          score: coins,
          accuracy: accuracy,
          timeTaken,
          level: 'all',
          twitterHandle: twitterHandle.trim() || null,
        }),
      })
      if (response.ok) {
        const entry = await response.json()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lastLeaderboardEntryId', entry.id)
        }
        setQuickPlaySaved(true)
      } else {
        const data = await response.json().catch(() => ({}))
        alert(`Failed to save: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert(`Error saving score. Please try again.`)
    } finally {
      setSubmittingLeaderboard(false)
    }
  }

  const handleViewStats = () => {
    // Signed-in users go to profile; Quick Play users go to stats by name/handle
    if (session?.user) {
      window.location.href = '/profile'
    } else {
      const identifier = twitterHandle.trim() 
        ? `?twitter=${twitterHandle.replace('@', '')}`
        : `?name=${encodeURIComponent(playerName.trim())}`
      window.location.href = `/stats${identifier}`
    }
  }

  const handleShareOnTwitter = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
    
    // Tweet templates for Brag mode - only the opening line changes
    const bragOpenings = [
      'Just crushed a session at Design Gym. My eye is getting sharper.',
      'Finished another round at Design Gym. Feeling confident about my design instincts.',
      'Design Gym session complete. My visual judgment is on point.',
      'Just leveled up my design eye at Design Gym. Results speak for themselves.'
    ]

    // Tweet templates for Humble mode - only the opening line changes
    const humbleOpenings = [
      'Just finished a session at Design Gym. Still learning, but making progress.',
      'Completed another round at Design Gym. Every session teaches me something new.',
      'Finished a Design Gym session. Practice makes progress, not perfect.',
      'Just wrapped up at Design Gym. Always room to improve, but happy with the effort.'
    ]

    // Select random opening based on tone
    const openings = shareTone === 'brag' ? bragOpenings : humbleOpenings
    const opening = openings[Math.floor(Math.random() * openings.length)]
    
    // Build tweet with consistent structure (score, accuracy, link never change)
    const tweetText = `${opening}

${coins} points • ${accuracy}% accuracy

${siteUrl}`
    
    const encodedText = encodeURIComponent(tweetText)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
    
    window.open(twitterUrl, '_blank')
  }
  
  // Qualitative feedback based on accuracy
  const getFeedback = (accuracy: number): string => {
    if (accuracy >= 80) return 'Strong eye'
    if (accuracy >= 50) return 'Solid progress'
    return 'Every session counts'
  }

  // Softer color scheme: green (strong), amber (solid), slate (building)
  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 80) return 'text-emerald-600'
    if (accuracy >= 50) return 'text-amber-700'
    return 'text-slate-600'
  }
  const getAccuracyBg = (accuracy: number): string => {
    if (accuracy >= 80) return 'bg-emerald-50 border-emerald-200'
    if (accuracy >= 50) return 'bg-amber-50 border-amber-200'
    return 'bg-slate-50 border-slate-200'
  }

  // Determine if the selected answer is correct
  const isCorrect = currentQuestion && selectedAnswer !== null && shuffledOptions
    ? selectedAnswer === shuffledOptions.correctAnswer
    : false

  // Safety check: if no current question, show loading or error state
  if (!currentQuestion || !shuffledOptions) {
    return (
      <>
        <Head>
          <title>Design Gym - Training</title>
        </Head>
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Loading questions...</p>
          </div>
        </main>
      </>
    )
  }

  // Determine which option is correct for visual feedback
  const leftIsCorrect = shuffledOptions.correctAnswer === 'left'
  const rightIsCorrect = shuffledOptions.correctAnswer === 'right'

  const imageChoiceOutline = (side: 'left' | 'right') => {
    if (currentQuestion.type === 'typeface') return null
    const selected = selectedAnswer === side
    const thisIsCorrect = side === 'left' ? leftIsCorrect : rightIsCorrect
    if (selected) return isCorrect ? 'border-green-500' : 'border-red-500'
    if (showExplanation && thisIsCorrect) return 'border-green-500'
    return null
  }

  return (
    <>
      <Head>
        <title>Design Gym - Training</title>
        <meta name="description" content="Practice your visual judgment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-white px-3 sm:px-6 py-6 sm:py-12 md:px-12 md:py-16 w-full overflow-x-hidden">
        {/* Fixed profile + coin counter at top-right */}
        <div className="fixed top-2 right-2 sm:top-8 sm:right-8 md:top-12 md:right-12 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (startTime && !completedLevel) {
                setShowLeaveConfirmModal(true)
              } else {
                window.location.href = session ? '/profile' : '/'
              }
            }}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-200 bg-gray-100 overflow-hidden flex-shrink-0 hover:bg-gray-200 transition-colors cursor-pointer"
            title="Your session"
          >
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-amber-200 rounded-[12px] px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-br from-amber-50 to-yellow-50" title="Coins earned this session">
            <svg 
              key={`coin-${coins}`}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isCoinAnimating ? 'coin-animate' : ''}`}
              style={{ transformOrigin: 'center', display: 'inline-block' }}
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="6" fill="#FCD34D" opacity="0.6"/>
              <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="#F59E0B" opacity="0.3"/>
            </svg>
            <span className="text-xs sm:text-sm font-semibold text-amber-900">{coins}</span>
          </div>
        </div>

        {/* Leave confirmation modal - portal to body so it's always on top */}
        {showLeaveConfirmModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div
              className="bg-white p-6 sm:p-8 max-w-sm w-full rounded-[2rem] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-center text-gray-900 mb-6">
                Leaving forfeits progress
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-medium rounded-[8px] hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Link
                  href="/profile"
                  className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-[8px] hover:bg-gray-800 transition-colors cursor-pointer text-center block"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
        <div className="max-w-6xl mx-auto w-full px-0">
          <div className="mb-8 sm:mb-12 text-center">
            <Link href="/">
              <img src="/logo-brand.png" alt="Design Gym" className="h-7 sm:h-8 md:h-9 w-auto mx-auto mb-3 sm:mb-4" />
            </Link>
            <div className="mb-4">
              <div className="text-xs sm:text-sm text-gray-500 mb-2">
                Question {currentQuestionIndex + 1} of {sessionQuestions.length}
              </div>
              <div className="w-full bg-gray-200 h-2 max-w-md mx-auto">
                <div 
                  className="bg-black h-2 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / sessionQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-center mb-6 sm:mb-8 px-2 text-gray-900">
              {currentQuestion.type === 'image' 
                ? currentQuestion.prompt 
                : currentQuestion.prompt}
            </h2>
          </div>

          <div
            className={
              currentQuestion.type === 'image'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-0 mb-8 sm:mb-12 w-full overflow-hidden rounded-3xl border border-gray-200 bg-[#F7F2EA]'
                : 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 w-full'
            }
          >
            <div
              onClick={() => handleSelect('left')}
              className="cursor-pointer transition-all relative group"
            >
              {currentQuestion.type === 'typeface' ? (
                <div
                  className={`p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center bg-white transition-transform ${!showExplanation ? 'group-hover:scale-[1.02]' : ''
                    }`}
                  style={{ fontFamily: shuffledOptions.leftOption }}
                >
                  <p className="text-2xl sm:text-3xl leading-relaxed text-center px-2">
                    {foxQuote}
                  </p>
                </div>
              ) : (
                <img
                  src={shuffledOptions.leftOption}
                  alt="Design option"
                  className={`w-full h-auto object-contain transition-transform ${!showExplanation ? 'group-hover:scale-[1.02]' : ''
                    }`}
                  style={{ maxHeight: '400px' }}
                />
              )}
              {imageChoiceOutline('left') && (
                <div
                  className={`absolute inset-0 z-20 pointer-events-none border-2 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl ${imageChoiceOutline('left')}`}
                />
              )}
              {selectedAnswer === 'left' && (
                <div className={`p-4 text-center font-medium ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                  {isCorrect ? '✓ Correct +100 coins' : '✗ Your choice'}
                </div>
              )}
            </div>

            <div
              onClick={() => handleSelect('right')}
              className={`cursor-pointer transition-all relative group ${currentQuestion.type === 'typeface' ? '' : 'md:border-l md:border-gray-200'}`}
            >
              {currentQuestion.type === 'typeface' ? (
                <div
                  className={`p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex items-center justify-center bg-white transition-transform ${!showExplanation ? 'group-hover:scale-[1.02]' : ''
                    }`}
                  style={{ fontFamily: shuffledOptions.rightOption }}
                >
                  <p className="text-2xl sm:text-3xl leading-relaxed text-center px-2">
                    {foxQuote}
                  </p>
                </div>
              ) : (
                <img
                  src={shuffledOptions.rightOption}
                  alt="Design option"
                  className={`w-full h-auto object-contain transition-transform ${!showExplanation ? 'group-hover:scale-[1.02]' : ''
                    }`}
                  style={{ maxHeight: '400px', maxWidth: '100%' }}
                />
              )}
              {imageChoiceOutline('right') && (
                <div
                  className={`absolute inset-0 z-20 pointer-events-none border-2 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl ${imageChoiceOutline('right')}`}
                />
              )}
              {selectedAnswer === 'right' && (
                <div className={`p-4 text-center font-medium ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                  {isCorrect ? '✓ Correct +100 coins' : '✗ Your choice'}
                </div>
              )}
            </div>
          </div>

          {showExplanation && (
            <div className="mb-8 px-5 py-3 bg-green-50 border-l-4 border-green-500">
              <p className="text-gray-800 font-medium">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {showExplanation && !isLastQuestion && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="hero-btn hero-btn-primary"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Instruction Modal - appears over first question */}
      {showInstructionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white px-6 py-8 sm:px-10 sm:py-10 max-w-xl w-full rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-medium tracking-tight mb-2 text-center text-gray-900">
              How Design Gym Works
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
              Sharpen your visual judgment. No sign-up required to try.
            </p>

            <div className="flex items-center gap-1 sm:gap-2 mb-6">
              <button
                type="button"
                aria-label="Previous step"
                onClick={() => setInstructionStep((step) => (step + HOW_IT_WORKS_STEPS.length - 1) % HOW_IT_WORKS_STEPS.length)}
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex-1 flex flex-col items-center text-center min-w-0 px-1">
                <div className="mb-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {instructionStep === 0 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                    {instructionStep === 1 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5h7v14H4zM13 5h7v14h-7z" />
                    )}
                    {instructionStep === 2 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-0.5">
                  {HOW_IT_WORKS_STEPS[instructionStep].title}
                </h3>
                <p className="text-gray-500 leading-snug text-xs sm:text-sm min-h-[2.5rem] flex items-center">
                  {HOW_IT_WORKS_STEPS[instructionStep].body}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-3" aria-hidden="true">
                  {HOW_IT_WORKS_STEPS.map((step, index) => (
                    <span
                      key={step.title}
                      className={`h-1.5 rounded-full transition-all ${
                        index === instructionStep ? 'w-4 bg-gray-900' : 'w-1.5 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-label="Next step"
                onClick={() => setInstructionStep((step) => (step + 1) % HOW_IT_WORKS_STEPS.length)}
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              {status === 'authenticated' ? (
                <button
                  onClick={handleStartTraining}
                  className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-black text-white font-normal hover:bg-gray-800 transition-colors rounded-full text-sm sm:text-base"
                >
                  Start Training
                </button>
              ) : (
                <>
                  <button
                    onClick={handleQuickPlay}
                    className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-black text-white font-normal hover:bg-gray-800 transition-colors rounded-full text-sm sm:text-base"
                  >
                    Quick Play
                  </button>
                  <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/quiz' })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 min-h-[44px] bg-white text-gray-900 font-normal hover:bg-gray-50 transition-colors rounded-full text-sm sm:text-base border border-gray-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
              {status === 'authenticated'
                ? 'Your score will be saved to the leaderboard.'
                : 'Quick Play is free. Sign up with Google to save your score and track streaks.'}
            </p>
          </div>
        </div>
      )}

      {/* Level Complete Modal */}
      {showLevelCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 max-w-md w-full mx-4 rounded-[2rem] shadow-lg max-h-[90vh] overflow-y-auto">
            {completedLevel === 'beginner' ? (
              <>
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-normal mb-4 text-center">
                  Beginner Level Complete!
                </h2>
                <p className="text-gray-700 mb-6 text-center leading-relaxed text-sm sm:text-base">
                  Great job completing the beginner level! Ready to move on to the intermediate level?
                </p>
                <div className="text-center">
                  <button
                    onClick={handleProceedToNextLevel}
                    className="hero-btn hero-btn-primary w-full sm:w-auto text-sm sm:text-base"
                  >
                    Continue to Next Level
                  </button>
                </div>
              </>
            ) : completedLevel === 'mid' ? (
              <>
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-normal mb-4 text-center">
                  Intermediate Level Complete!
                </h2>
                <p className="text-gray-700 mb-6 text-center leading-relaxed text-sm sm:text-base">
                  Excellent work! Ready to move on to the expert level?
                </p>
                <div className="text-center">
                  <button
                    onClick={handleProceedToNextLevel}
                    className="hero-btn hero-btn-primary w-full sm:w-auto text-sm sm:text-base"
                  >
                    Continue to Next Level
                  </button>
                </div>
              </>
            ) : completedLevel === 'expert' ? (
              <>
                <div className="flex justify-center mb-6">
                  <img 
                    src="/Icons/Brain%20icon%20copy.png" 
                    alt="Brain icon" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1.5 text-center">
                  Session Complete
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Nice work. Every session sharpens your eye.
                </p>

                {/* Results - celebrate the achievement */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-5">
                    <div className="flex items-center gap-3 border-2 border-amber-200 rounded-2xl px-6 py-4 bg-gradient-to-br from-amber-50 to-yellow-50">
                      <svg className="w-8 h-8 coin-animate-loop coin-glow flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="6" fill="#FCD34D" opacity="0.6"/>
                        <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="#F59E0B" opacity="0.3"/>
                      </svg>
                      <div>
                        <span className="text-xs font-medium text-amber-700 uppercase tracking-wider block">Coins</span>
                        <span className="text-2xl font-bold text-amber-900">{coins}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 border-2 rounded-2xl px-6 py-4 ${getAccuracyBg(accuracy)}`}>
                      <div className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>{accuracy}%</div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Accuracy</span>
                        <span className="text-sm font-medium text-gray-700">{getFeedback(accuracy)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign up prompt for Quick Play users - after results */}
                {isQuickPlay && !quickPlaySaved && !quickPlaySignUpDismissed && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-[12px] bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 mb-1 text-center">
                      Save your score to the leaderboard
                    </p>
                    <p className="text-xs text-gray-500 text-center mb-3">
                      See how you rank and track your progress
                    </p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Your name"
                        maxLength={20}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-[8px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                        placeholder="Twitter handle (optional)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-[8px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleQuickPlaySaveToLeaderboard}
                          disabled={!playerName.trim() || submittingLeaderboard}
                          className="flex-1 px-4 py-2.5 bg-black text-white font-medium rounded-[8px] hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {submittingLeaderboard ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setQuickPlaySignUpDismissed(true)}
                          className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Maybe later
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isQuickPlay && quickPlaySaved && (
                  <p className="text-sm text-green-600 font-medium text-center mb-4">
                    Score saved! You&apos;re on the leaderboard.
                  </p>
                )}
                
                {/* Share tone - segmented control */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2 text-center">Share tone</p>
                  <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 mx-auto">
                    <button
                      onClick={() => setShareTone('humble')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        shareTone === 'humble'
                          ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Humble
                    </button>
                    <button
                      onClick={() => setShareTone('brag')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        shareTone === 'brag'
                          ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Brag
                    </button>
                  </div>
                </div>
                
                {/* Action buttons - clear hierarchy */}
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleViewLeaderboard}
                      className="flex-1 px-6 sm:px-8 py-3.5 bg-black text-white font-medium hover:bg-gray-800 transition-colors whitespace-nowrap rounded-xl text-sm sm:text-base"
                    >
                      View Leaderboard
                    </button>
                    {(!isQuickPlay || quickPlaySaved) && (
                      <button
                        onClick={handleViewStats}
                        className="flex-1 px-6 sm:px-8 py-3.5 bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors whitespace-nowrap rounded-xl text-sm sm:text-base border border-gray-200"
                      >
                        View Your Stats
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleShareOnTwitter}
                    className="w-full px-6 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Share on X
                  </button>
                </div>
                <div className="text-center pt-4 border-t border-gray-100">
                  <button
                    onClick={handleStartOver}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

    </>
  )
}
