import { query } from '../db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Run database migrations
 * This script should be run once to set up your database schema
 */
async function runMigrations() {
  try {
    console.log('Running database migrations...')
    
    // Read migration file
    const migrationPath = path.join(__dirname, '001_create_leaderboard.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute migration
    await query(migrationSQL)
    
    console.log('✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()

