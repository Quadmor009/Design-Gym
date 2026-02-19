import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { query } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const userId = (session.user as { id?: string }).id
  if (!userId) {
    return res.status(401).json({ error: 'User ID not found' })
  }

  if (req.method === 'GET') {
    try {
      const result = await query(
        'SELECT current_streak, last_practice_date FROM streaks WHERE user_id = $1',
        [userId]
      )
      const row = result.rows[0]
      if (!row) {
        return res.status(200).json({ currentStreak: 0, lastPracticeDate: null })
      }
      return res.status(200).json({
        currentStreak: row.current_streak || 0,
        lastPracticeDate: row.last_practice_date,
      })
    } catch (error) {
      console.error('Error fetching streak:', error)
      return res.status(500).json({ error: 'Failed to fetch streak' })
    }
  }

  // POST - record a practice session (call when quiz completes)
  if (req.method === 'POST') {
    try {
      const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

      const existing = await query(
        'SELECT current_streak, last_practice_date FROM streaks WHERE user_id = $1',
        [userId]
      )

      let newStreak: number
      if (existing.rows.length === 0) {
        newStreak = 1
        await query(
          `INSERT INTO streaks (user_id, current_streak, last_practice_date, updated_at)
           VALUES ($1, 1, $2::date, CURRENT_TIMESTAMP)
           ON CONFLICT (user_id) DO UPDATE SET
             current_streak = EXCLUDED.current_streak,
             last_practice_date = EXCLUDED.last_practice_date,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, today]
        )
      } else {
        const { current_streak, last_practice_date } = existing.rows[0]
        const lastDate = last_practice_date
          ? new Date(last_practice_date).toISOString().slice(0, 10)
          : null

        if (lastDate === today) {
          newStreak = current_streak || 1
        } else {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().slice(0, 10)

          if (lastDate === yesterdayStr) {
            newStreak = (current_streak || 0) + 1
          } else {
            newStreak = 1
          }
          await query(
            `INSERT INTO streaks (user_id, current_streak, last_practice_date, updated_at)
             VALUES ($1, $2, $3::date, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO UPDATE SET
               current_streak = EXCLUDED.current_streak,
               last_practice_date = EXCLUDED.last_practice_date,
               updated_at = CURRENT_TIMESTAMP`,
            [userId, newStreak, today]
          )
        }
      }

      return res.status(200).json({ currentStreak: newStreak })
    } catch (error) {
      console.error('Error recording streak:', error)
      return res.status(500).json({ error: 'Failed to record streak' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
