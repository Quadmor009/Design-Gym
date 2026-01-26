import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Debug endpoint to check if environment variables are set
 * This helps troubleshoot database connection issues
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const databaseUrlLength = process.env.DATABASE_URL?.length || 0
    const nodeEnv = process.env.NODE_ENV
    const databaseUrlPreview = process.env.DATABASE_URL 
      ? `${process.env.DATABASE_URL.substring(0, 20)}...${process.env.DATABASE_URL.substring(process.env.DATABASE_URL.length - 10)}`
      : 'not set'

    res.status(200).json({
      hasDatabaseUrl,
      databaseUrlLength,
      databaseUrlPreview,
      nodeEnv,
      message: hasDatabaseUrl 
        ? 'DATABASE_URL is set ✅' 
        : 'DATABASE_URL is NOT set ❌ - Add it to your environment variables and redeploy',
      hint: hasDatabaseUrl 
        ? 'Database connection should work. If you still see 503 errors, check the database URL format.'
        : 'Go to Vercel → Settings → Environment Variables → Add DATABASE_URL → Redeploy',
      instructions: !hasDatabaseUrl ? [
        '1. Go to https://vercel.com/dashboard',
        '2. Select your project',
        '3. Settings → Environment Variables',
        '4. Add DATABASE_URL with your Render PostgreSQL External Database URL',
        '5. Select all environments (Production, Preview, Development)',
        '6. Save and Redeploy'
      ] : []
    })
  } catch (error) {
    res.status(500).json({
      error: 'Error checking environment',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

