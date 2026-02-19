const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set.')
  process.exit(1)
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

async function runMigration() {
  try {
    console.log('Running migration 004: Twitter auth support...')
    const migrationPath = path.join(__dirname, '004_twitter_auth.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    await pool.query(migrationSQL)
    console.log('✅ Migration 004 completed successfully!')
  } catch (error) {
    console.error('❌ Migration 004 failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

runMigration()
