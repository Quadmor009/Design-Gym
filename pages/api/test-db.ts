import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Simple test query
    const result = await query('SELECT NOW() as current_time')
    res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      time: result.rows[0].current_time
    })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

