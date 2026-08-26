import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { promptGuessQuestions, PromptGuessQuestion } from '../data/promptGuessData'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function shuffleOptions(optionA: string, optionB: string, _correctOption: 'A') {
  const options = [
    { value: optionA, isCorrect: true },
    { value: optionB, isCorrect: false },
  ]
  const shuffled = shuffleArray(options)
  const leftIsCorrect = shuffled[0].isCorrect

  return {
    leftOption: shuffled[0].value,
    rightOption: shuffled[1].value,
    correctAnswer: (leftIsCorrect ? 'left' : 'right') as 'left' | 'right',
  }
}

export default function GuessThePromptContent() {
  const [sessionQuestions, setSessionQuestions] = useState<PromptGuessQuestion[]>(() =>
    shuffleArray(promptGuessQuestions)
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'left' | 'right' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showInstructionModal, setShowInstructionModal] = useState(true)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false)
  const [sessionFinished, setSessionFinished] = useState(false)
  const [coins, setCoins] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [isCoinAnimating, setIsCoinAnimating] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    document.body.classList.add('quiz-page')
    return () => {
      document.body.classList.remove('quiz-page')
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (startTime && !sessionFinished) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [startTime, sessionFinished])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentQuestionIndex])

  const currentQuestion = sessionQuestions[currentQuestionIndex]

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return null
    return shuffleOptions(
      currentQuestion.optionA,
      currentQuestion.optionB,
      currentQuestion.correctOption
    )
  }, [currentQuestion])

  useEffect(() => {
    setImageFailed(false)
  }, [currentQuestion?.id])

  const isLastQuestion = currentQuestionIndex === sessionQuestions.length - 1
  const totalQuestions = sessionQuestions.length
  const maxCoins = totalQuestions * 100
  const accuracy = totalQuestions > 0 ? Math.round((coins / maxCoins) * 100) : 0

  const handleSelect = (side: 'left' | 'right') => {
    if (showExplanation || !currentQuestion || !shuffledOptions) return

    setSelectedAnswer(side)
    setShowExplanation(true)

    const isCorrect = side === shuffledOptions.correctAnswer

    if (!answeredQuestions.has(currentQuestionIndex)) {
      setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex))
      if (isCorrect) {
        setCoins((prev) => prev + 100)
        setIsCoinAnimating(true)
        setTimeout(() => setIsCoinAnimating(false), 400)
      }
    }

    if (isLastQuestion) {
      setTimeout(() => {
        setSessionFinished(true)
        setShowCompleteModal(true)
      }, 500)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setSessionFinished(true)
      setShowCompleteModal(true)
      return
    }
    setCurrentQuestionIndex((i) => i + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleStart = () => {
    setShowInstructionModal(false)
    setStartTime(Date.now())
  }

  const handleStartOver = () => {
    setShowCompleteModal(false)
    setSessionFinished(false)
    setSessionQuestions(shuffleArray(promptGuessQuestions))
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCoins(0)
    setAnsweredQuestions(new Set())
    setStartTime(Date.now())
  }

  const isCorrect =
    currentQuestion && selectedAnswer !== null && shuffledOptions
      ? selectedAnswer === shuffledOptions.correctAnswer
      : false

  const leftIsCorrect = shuffledOptions?.correctAnswer === 'left'
  const rightIsCorrect = shuffledOptions?.correctAnswer === 'right'

  const promptChoiceOutline = (side: 'left' | 'right') => {
    const selected = selectedAnswer === side
    const thisIsCorrect = side === 'left' ? leftIsCorrect : rightIsCorrect
    if (selected) return isCorrect ? 'border-green-500' : 'border-red-500'
    if (showExplanation && thisIsCorrect) return 'border-green-500'
    return 'border-gray-200'
  }

  const getFeedback = (value: number): string => {
    if (value >= 80) return 'Strong eye for prompts'
    if (value >= 50) return 'Solid progress'
    return 'Every session counts'
  }

  if (!currentQuestion || !shuffledOptions) {
    return (
      <>
        <Head>
          <title>Guess the Prompt - Design Gym</title>
        </Head>
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500">Loading questions...</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Guess the Prompt - Design Gym</title>
        <meta name="description" content="Pick which prompt generated the image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-white px-3 sm:px-6 py-6 sm:py-12 md:px-12 md:py-16 w-full">
        <div className="fixed top-2 right-2 sm:top-8 sm:right-8 md:top-12 md:right-12 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (startTime && !sessionFinished) {
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
              <circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="6" fill="#FCD34D" opacity="0.6" />
              <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="#F59E0B" opacity="0.3" />
            </svg>
            <span className="text-xs sm:text-sm font-semibold text-amber-900">{coins}</span>
          </div>
        </div>

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
                  href="/"
                  className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-[8px] hover:bg-gray-800 transition-colors cursor-pointer text-center block"
                >
                  Continue
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}

        <div className="max-w-3xl mx-auto w-full min-w-0">
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
                />
              </div>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-center mb-6 sm:mb-8 px-2 text-gray-900">
            Which prompt generated this image?
          </h2>

          <div className="mb-8 sm:mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-[#F7F2EA]">
            {imageFailed ? (
              <div className="min-h-[240px] sm:min-h-[320px] flex flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-sm text-gray-600 mb-1">Image coming soon</p>
                <p className="text-xs text-gray-400 break-all">{currentQuestion.image}</p>
              </div>
            ) : (
              <img
                src={encodeURI(currentQuestion.image)}
                alt="Generated image to match with a prompt"
                className="w-full max-w-full h-auto object-contain"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-8">
            {(['left', 'right'] as const).map((side) => {
              const text = side === 'left' ? shuffledOptions.leftOption : shuffledOptions.rightOption
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => handleSelect(side)}
                  disabled={showExplanation}
                  className={`text-left w-full rounded-2xl border-2 bg-white px-5 py-4 sm:px-6 sm:py-5 transition-colors ${promptChoiceOutline(side)} ${
                    showExplanation ? 'cursor-default' : 'cursor-pointer hover:border-gray-400'
                  }`}
                >
                  <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
                    {text}
                  </p>
                  {selectedAnswer === side && (
                    <p className={`mt-3 text-sm font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? '✓ Correct +100 coins' : '✗ Your choice'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div className="mb-8 px-5 py-3 bg-green-50 border-l-4 border-green-500">
              <p className="text-gray-800 font-medium">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {showExplanation && !isLastQuestion && (
            <div className="quiz-actions flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleNext}
                className="hero-btn hero-btn-primary"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </main>

      {showInstructionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white px-6 py-8 sm:px-10 sm:py-10 max-w-xl w-full rounded-[2rem] shadow-2xl">
            <h2 className="text-2xl font-medium tracking-tight mb-2 text-center text-gray-900">
              Guess the Prompt
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              One image. Two prompts. Pick the one that was used to generate it.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleStart}
                className="hero-btn hero-btn-primary"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-complete-title"
            className="bg-white px-6 py-8 sm:px-8 sm:py-10 max-w-sm w-full rounded-[2rem] shadow-2xl"
          >
            <div className="flex justify-center mb-5">
              <img
                src="/Icons/Brain%20icon%20copy.png"
                alt=""
                className="w-14 h-14 object-contain"
              />
            </div>
            <h2
              id="session-complete-title"
              className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 text-center"
            >
              Session complete
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2 mb-7 leading-relaxed">
              {Math.round(coins / 100)} of {totalQuestions} correct. {getFeedback(accuracy)}.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="rounded-2xl border border-amber-200 bg-[#FBF6EE] px-3 py-4 text-center">
                <p className="text-xs text-amber-800 mb-1.5">Coins</p>
                <p className="text-2xl font-semibold text-amber-950 tabular-nums">{coins}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#F7F2EA] px-3 py-4 text-center">
                <p className="text-xs text-gray-500 mb-1.5">Accuracy</p>
                <p className="text-2xl font-semibold text-gray-900 tabular-nums">{accuracy}%</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleStartOver}
                className="hero-btn hero-btn-primary w-full"
              >
                Play again
              </button>
              <Link
                href="/"
                className="hero-btn hero-btn-secondary w-full"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
