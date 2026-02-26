import { Pool } from 'pg'

let pool: Pool | null = null

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set it in your .env.local file (for local) or deployment platform environment variables (for production).'
    )
  }

  const newPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 5000,
    max: process.env.VERCEL ? 1 : 10,
  })

  newPool.on('error', (err) => {
    console.error('Pool error — will recreate on next query:', err.message)
    pool = null
  })

  return newPool
}

function getDbPool(): Pool {
  if (!pool) {
    pool = createPool()
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const MAX_RETRIES = 2

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const db = getDbPool()
      const result = await db.query(text, params)
      return result
    } catch (error: any) {
      const isConnectionError =
        error?.message?.includes('Connection terminated') ||
        error?.message?.includes('connection timeout') ||
        error?.message?.includes('ECONNRESET') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.code === 'EPIPE' ||
        error?.code === '57P01'

      if (isConnectionError && attempt < MAX_RETRIES) {
        console.warn(`DB connection error (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying...`)
        pool = null
        continue
      }

      if (error instanceof Error) {
        throw new Error(`Database query failed: ${error.message}`)
      }
      throw error
    }
  }

  throw new Error('Database query failed after retries')
}

export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1')
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}
