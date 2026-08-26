import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function GuessThePrompt() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/quiz?category=prompt')
  }, [router])

  return (
    <>
      <Head>
        <title>Guess the Prompt - Design Gym</title>
      </Head>
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </main>
    </>
  )
}
