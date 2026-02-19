import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

/**
 * Diagnostic endpoint: attempts a test insert and returns the actual error.
 * Visit: /api/leaderboard-test
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const result: Record<string, unknown> = {
    databaseUrlSet: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length ?? 0,
    vercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }

  if (!process.env.DATABASE_URL) {
    return res.status(200).json({
      ...result,
      error: 'DATABASE_URL is not set',
      hint: 'Add DATABASE_URL to Vercel Environment Variables and redeploy',
    })
  }

  try {
    // Test 1: Simple query
    const pingResult = await query('SELECT 1 as ok')
    result.pingOk = pingResult.rows[0]?.ok === 1

    // Test 2: Check leaderboard table exists
    const tableCheck = await query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'leaderboard'`
    )
    result.leaderboardColumns = tableCheck.rows.map((r: { column_name: string }) => r.column_name)

    // Test 3: Attempt a real insert (then delete) - no user_id (column may not exist)
    const testId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    try {
      await query(
        `INSERT INTO leaderboard (id, name, score, accuracy, time_taken, level, timestamp, twitter_handle)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [testId, 'Test User', 100, 50, 60, 'all', Date.now(), null]
      )
      result.insertOk = true
      // Clean up
      await query('DELETE FROM leaderboard WHERE id = $1', [testId])
      result.cleanupOk = true
    } catch (insertErr: unknown) {
      result.insertError = insertErr instanceof Error ? insertErr.message : String(insertErr)
      result.insertErrorCode = (insertErr as { code?: string })?.code
      result.insertErrorDetail = (insertErr as { detail?: string })?.detail
    }

    return res.status(200).json(result)
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error)
    result.errorStack = error instanceof Error ? error.stack : undefined
    return res.status(200).json(result)
  }
}
