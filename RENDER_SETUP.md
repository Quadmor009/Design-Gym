# Render Backend Setup Guide

This guide will help you connect your Design Gym application to a PostgreSQL database on Render.

## Step 1: Create PostgreSQL Database on Render

1. **Log in to Render**
   - Go to https://dashboard.render.com
   - Sign in or create an account

2. **Create a PostgreSQL Database**
   - Click "New +" in the top right
   - Select "PostgreSQL"
   - Choose a name (e.g., `design-gym-db`)
   - Select your subscription plan
   - Choose a region close to your users
   - Click "Create Database"

3. **Get Your Database Connection String**
   - Once created, click on your database
   - Find the "Connections" section
   - You'll see two URLs:
     - **External Database URL** - Use this for local development (your computer)
     - **Internal Database URL** - Use this for production (when your app is hosted on Render)
   - **For now, copy the "External Database URL"** (you'll use this in Step 2)
   - It will look like: `postgresql://user:password@hostname:5432/database`

## Step 2: Set Up Environment Variables

### For Local Development

1. **Create `.env.local` file** in your project root:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your database URL** to `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@hostname:5432/database
   ```
   **Important:** Paste the **External Database URL** you copied from Render (this allows your local computer to connect to the database)

### For Production (Render Web Service)

When you deploy your Next.js app to Render:

1. **Create a Web Service** on Render
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect it's a Next.js app

2. **Add Environment Variable**
   - In your Web Service settings, go to "Environment"
   - Add a new variable:
     - **Key**: `DATABASE_URL`
     - **Value**: Your **Internal Database URL** from Step 1 (this is different from the External URL - use the Internal one for Render-to-Render connections)
   - Click "Save Changes"

## Step 3: Run Database Migration

Before using the app, you need to create the database table.

### Option A: Using Render PostgreSQL Dashboard

1. Go to your PostgreSQL database on Render
2. Click "Connect" → "psql" (or use any SQL client)
3. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS leaderboard (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  accuracy DECIMAL(5, 2) NOT NULL,
  time_taken INTEGER NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'mid', 'expert', 'all')),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON leaderboard(level);
CREATE INDEX IF NOT EXISTS idx_leaderboard_ranking ON leaderboard(score DESC, accuracy DESC, time_taken ASC);
```

### Option B: Using Migration Script (Local)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up your `.env.local`** with the External Database URL

3. **Run the migration**:
   ```bash
   npx ts-node lib/migrations/run-migration.ts
   ```

## Step 4: Test the Connection

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the leaderboard**:
   - Complete a quiz and submit your score
   - Check the leaderboard page
   - Verify your entry appears

## Step 5: Deploy to Render (Optional)

If you want to host your Next.js app on Render:

1. **Create a Web Service**
   - Connect your GitHub repository
   - Render will auto-detect Next.js

2. **Set Environment Variables**
   - Add `DATABASE_URL` with your Internal Database URL
   - Add `NODE_ENV=production`

3. **Deploy**
   - Render will automatically build and deploy
   - Your app will be live at `https://your-app.onrender.com`

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Make sure you've created `.env.local` for local development
- Make sure you've added `DATABASE_URL` to Render environment variables for production

### "Connection refused" or "Cannot connect to database"
- Check that your database is running on Render
- Verify the connection string is correct
- For local development, use the External Database URL
- For production, use the Internal Database URL

### "relation 'leaderboard' does not exist"
- You need to run the database migration (Step 3)
- Make sure the migration SQL ran successfully

### SSL Connection Errors
- The code automatically handles SSL for production
- If you get SSL errors locally, you can temporarily disable SSL in `lib/db.ts` (not recommended for production)

## Database Schema

The leaderboard table stores:
- `id`: Unique identifier for each entry
- `name`: Player name
- `score`: Total score
- `accuracy`: Percentage accuracy (0-100)
- `time_taken`: Time taken in seconds
- `level`: Difficulty level (beginner, mid, expert, all)
- `timestamp`: Unix timestamp when entry was created
- `created_at`: Database timestamp

## Next Steps

- Your leaderboard will now persist across deployments
- All scores are stored in the database
- You can query the database directly if needed
- Consider adding data retention policies if you expect many entries

