import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { query } from '../../lib/db'

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  accuracy: number
  timeTaken: number // in seconds
  level: 'beginner' | 'mid' | 'expert' | 'all'
  timestamp: number
  twitterHandle?: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')))
      
      // Add debug info in response for easier troubleshooting
      const debugInfo = req.query.debug === 'true' ? {
        nodeEnv: process.env.NODE_ENV,
        availableEnvVars: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('VERCEL')),
        timestamp: new Date().toISOString()
      } : {}
      
      return res.status(503).json({ 
        error: 'Database not configured',
        message: 'DATABASE_URL environment variable is missing. Please add it in your deployment platform (Vercel/Render) environment variables and redeploy.',
        hint: 'Make sure to redeploy after adding the environment variable',
        ...debugInfo
      })
    }
    
    // Log that we have the URL (but don't log the actual URL for security)
    console.log('DATABASE_URL is set, length:', process.env.DATABASE_URL.length)

    if (req.method === 'GET') {
      const { level = 'all', debug } = req.query
      
      // If debug mode, return diagnostic info
      if (debug === 'true') {
        return res.status(200).json({
          success: true,
          databaseConfigured: true,
          databaseUrlLength: process.env.DATABASE_URL?.length || 0,
          nodeEnv: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          message: 'Database is configured. Attempting to fetch leaderboard...'
        })
      }
      
      let sql: string
      let params: any[] = []
      
      if (level === 'all' || level === 'global') {
        // Get all entries, sorted by score DESC, accuracy DESC, time_taken ASC
        sql = `
          SELECT id, name, score, accuracy, time_taken as "timeTaken", level, timestamp, twitter_handle as "twitterHandle"
          FROM leaderboard
          ORDER BY score DESC, accuracy DESC, time_taken ASC
        `
      } else {
        // Filter by level
        sql = `
          SELECT id, name, score, accuracy, time_taken as "timeTaken", level, timestamp, twitter_handle as "twitterHandle"
          FROM leaderboard
          WHERE level = $1
          ORDER BY score DESC, accuracy DESC, time_taken ASC
        `
        params = [level]
      }
      
      const result = await query(sql, params)
      const entries: LeaderboardEntry[] = result.rows
      
      res.status(200).json(entries)
      
    } else if (req.method === 'POST') {
      const entry: LeaderboardEntry = req.body
      
      // Validate entry
      if (!entry.name || entry.score === undefined || entry.accuracy === undefined || entry.timeTaken === undefined) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      
      // Coerce to numbers (client may send strings)
      const score = Number(entry.score) || 0
      const accuracy = Number(entry.accuracy) || 0
      const timeTaken = Number(entry.timeTaken) || 0
      const level = ['beginner', 'mid', 'expert', 'all'].includes(entry.level) ? entry.level : 'all'
      
      // Generate ID and timestamp
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const timestamp = Date.now()

      // Get userId from session if signed in (optional - score saves even without it)
      let session
      try {
        session = await getServerSession(req, res, authOptions)
      } catch (sessionErr) {
        console.warn('Session fetch failed, saving without user link:', sessionErr)
      }
      let userId = (session?.user as { id?: string } | undefined)?.id ?? null
      
      // Normalize Twitter handle (remove @ if present, add it back)
      const twitterHandle = entry.twitterHandle 
        ? entry.twitterHandle.startsWith('@') 
          ? entry.twitterHandle 
          : `@${entry.twitterHandle}`
        : null
      
      // Minimal insert fallback - only base columns (works if migrations 002/003 not run)
      const minimalSQL = `
        INSERT INTO leaderboard (id, name, score, accuracy, time_taken, level, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, score, accuracy, time_taken as "timeTaken", level, timestamp
      `
      const fullSQL = `
        INSERT INTO leaderboard (id, name, score, accuracy, time_taken, level, timestamp, twitter_handle, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, name, score, accuracy, time_taken as "timeTaken", level, timestamp, twitter_handle as "twitterHandle"
      `
      
      const baseParams = [id, String(entry.name).trim(), score, accuracy, timeTaken, level, timestamp]
      const fullParams = [...baseParams, twitterHandle, userId]
      const fallbackParams = [...baseParams, twitterHandle, null]
      
      let result
      try {
        result = await query(fullSQL, fullParams)
      } catch (insertErr: unknown) {
        // Retry without user_id (FK or user-related)
        if (userId) {
          try {
            result = await query(fullSQL, fallbackParams)
          } catch (retryErr) {
            // Last resort: minimal insert (no user_id, no twitter_handle) - ensures score is NEVER lost
            console.warn('Full insert failed, trying minimal:', retryErr)
            try {
              result = await query(minimalSQL, baseParams)
            } catch (minimalErr) {
              console.error('All insert attempts failed:', { insertErr, retryErr, minimalErr })
              throw minimalErr
            }
          }
        } else {
          // Try minimal in case twitter_handle or other column causes issues
          try {
            result = await query(minimalSQL, baseParams)
          } catch (minimalErr) {
            throw insertErr
          }
        }
      }
      
      const row = result.rows[0]
      const newEntry: LeaderboardEntry = {
        id: row.id,
        name: row.name,
        score: row.score,
        accuracy: row.accuracy,
        timeTaken: row.timeTaken,
        level: row.level,
        timestamp: row.timestamp,
        twitterHandle: row.twitterHandle ?? null,
      }
      
      res.status(201).json(newEntry)
      
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Leaderboard API error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Request method:', req.method)
    console.error('Request URL:', req.url)
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.error('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0)
    
    // Ensure we always send a response, even if there's an error
    if (!res.headersSent) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorDetails = process.env.NODE_ENV === 'production' 
        ? 'Check Vercel function logs for details'
        : errorMessage
      
      res.status(500).json({ 
        error: 'Internal server error',
        message: errorDetails,
        hint: 'If using Render Postgres, try the connection pooler URL in Dashboard. Ensure DATABASE_URL is set in Vercel env vars.',
        ...(process.env.NODE_ENV !== 'production' && { details: errorMessage })
      })
    }
  }
}
