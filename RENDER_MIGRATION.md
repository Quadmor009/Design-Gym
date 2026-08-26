# Render Database Migration Guide

Follow these steps to add the `user_id` column to your leaderboard (so scores link to signed-in users).

---

## Step 1: Open Render Dashboard

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in
3. Click your **PostgreSQL** database (the one used by Design Gym)

---

## Step 2: Open the Shell / Connect

1. In the left sidebar, click **Connect** or **Shell**
2. You should see:
   - **Internal Database URL** (for Render services)
   - **External Database URL** (for Vercel – this is what you use in Vercel env vars)
3. Click **Connect** or **Open Shell** to get a database prompt (psql or web shell)

---

## Step 3: Run the Migration SQL

Copy and paste this SQL **one block at a time**, or all at once:

```sql
-- 1. Create users table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255),  -- nullable for Twitter auth compatibility
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create streaks table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS streaks (
  user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add user_id to leaderboard
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL;

-- 4. Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id) WHERE user_id IS NOT NULL;
```

Press Enter (or Run) after each block, or run all together.

---

## Step 4: Verify

Run:

```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'leaderboard' ORDER BY ordinal_position;
```

You should see `user_id` in the list.

---

## Step 5: Redeploy (Optional)

Scores already save without `user_id`. After this migration:

- The `user_id` column will exist for future use
- Your Progress page will continue to match scores by name
- We can later update the code to link scores to signed-in users via `user_id`

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `relation "users" does not exist` | Run the `CREATE TABLE users` block first |
| `column "user_id" already exists` | Migration already ran – you’re done |
| Can't find Shell / Connect | Look for **Shell**, **Connect**, or **Query** in the database settings |

---

## Connection URL (Vercel)

Make sure your Vercel `DATABASE_URL` is the **External** URL from Render (not Internal).

Format: `postgresql://USER:PASSWORD@HOST.oregon-postgres.render.com/DATABASE`

Your `.env.local` already has this format – use the same value in Vercel.
