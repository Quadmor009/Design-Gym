import { NextPageContext } from 'next'
import Head from 'next/head'

interface ErrorProps {
  statusCode: number
  hasGetInitialPropsRun?: boolean
  err?: Error
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  return (
    <>
      <Head>
        <title>Error - Design Gym</title>
      </Head>
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-black mb-4">
            {statusCode ? `Error ${statusCode}` : 'An error occurred'}
          </h1>
          <p className="text-gray-600 mb-6">
            {statusCode === 404
              ? 'This page could not be found.'
              : 'Something went wrong. Please try again later.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-[8px]"
          >
            Go back home
          </a>
          {process.env.NODE_ENV === 'development' && err && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded text-left">
              <p className="text-sm font-mono text-red-800">{err.message}</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404
  return { statusCode, hasGetInitialPropsRun: true, err: err as Error }
}

export default Error

