import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { query } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Get user id - from session or look up by email
  let userId = (session.user as { id?: string }).id
  if (!userId && session.user.email) {
    try {
      const userRow = await query('SELECT id FROM users WHERE email = $1', [session.user.email])
      userId = userRow.rows[0]?.id
    } catch {
      userId = session.user.email
    }
  }

  const userName = session.user.name || session.user.email?.split('@')[0] || 'Designer'

  try {
    let sessions: Array<{ id: string; score: number; accuracy: number; timeTaken: number; timestamp: number }> = []
    let currentStreak = 0

    // Fetch leaderboard entries (by user_id if available, else by name as fallback)
    try {
      if (userId) {
        const sessionsResult = await query(
          `SELECT id, score, accuracy, time_taken as "timeTaken", timestamp
           FROM leaderboard
           WHERE user_id = $1
           ORDER BY timestamp DESC`,
          [userId]
        )
        sessions = sessionsResult.rows
      }
      // Fallback: match by name if no user_id entries
      if (sessions.length === 0 && userName) {
        const fallbackResult = await query(
          `SELECT id, score, accuracy, time_taken as "timeTaken", timestamp
           FROM leaderboard
           WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
           ORDER BY timestamp DESC
           LIMIT 20`,
          [userName]
        )
        sessions = fallbackResult.rows
      }
    } catch (dbErr) {
      console.error('Profile API - sessions query:', dbErr)
    }

    // Fetch streak (table may not exist if migration not run)
    try {
      if (userId) {
        const streakResult = await query(
          'SELECT current_streak FROM streaks WHERE user_id = $1',
          [userId]
        )
        currentStreak = streakResult.rows[0]?.current_streak ?? 0
      }
    } catch {
      // Streaks table may not exist - ignore
    }

    // Calculate stats
    const totalSessions = sessions.length
    const personalBestScore = sessions.length > 0 ? Math.max(...sessions.map(s => s.score)) : 0
    const averageAccuracy = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + parseFloat(String(s.accuracy)), 0) / sessions.length
      : 0
    const averageTime = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.timeTaken, 0) / sessions.length
      : 0

    const recentSessions = sessions.slice(0, 15).map(s => ({
      id: s.id,
      score: s.score,
      accuracy: parseFloat(String(s.accuracy)),
      timeTaken: s.timeTaken,
      timestamp: s.timestamp,
      date: new Date(s.timestamp).toLocaleDateString(),
    }))

    res.status(200).json({
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      streak: currentStreak,
      totalSessions,
      personalBestScore,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      averageTime: Math.round(averageTime),
      recentSessions,
    })
  } catch (error) {
    console.error('Profile API error:', error)
    // Return minimal profile so page still loads
    res.status(200).json({
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      streak: 0,
      totalSessions: 0,
      personalBestScore: 0,
      averageAccuracy: 0,
      averageTime: 0,
      recentSessions: [],
    })
  }
}
