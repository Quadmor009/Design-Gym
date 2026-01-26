# Debugging Production Issues

## Step 1: Check Vercel Function Logs

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your project

2. **View Function Logs**
   - Click **Deployments** tab
   - Click on the latest deployment
   - Click **Functions** tab
   - Look for `/api/leaderboard` function
   - Click on it to see logs

3. **What to look for:**
   - `DATABASE_URL is not set` - Environment variable missing
   - `DATABASE_URL is set, length: XXX` - Variable is set
   - `Database query error` - Connection issue
   - Any error messages

## Step 2: Test the Leaderboard Endpoint

Visit: `https://your-site.vercel.app/api/leaderboard`

**Expected responses:**

### If DATABASE_URL is NOT set:
```json
{
  "error": "Database not configured",
  "message": "DATABASE_URL environment variable is missing...",
  "hint": "Make sure to redeploy after adding the environment variable"
}
```

### If DATABASE_URL IS set but connection fails:
```json
{
  "error": "Internal server error",
  "message": "Check Vercel function logs for details"
}
```

### If working correctly:
```json
[]
```
(Empty array - means it's working, just no scores yet)

## Step 3: Verify Environment Variable in Vercel

1. **Go to Settings → Environment Variables**
2. **Check:**
   - Is `DATABASE_URL` listed?
   - Does the value start with `postgresql://`?
   - Are all environments checked? (Production, Preview, Development)
   - Is there any whitespace or quotes around the value?

3. **If it's not there or wrong:**
   - Add/Edit it
   - Use your Render PostgreSQL **External Database URL**
   - Save
   - **Redeploy** (important!)

## Step 4: Check Deployment Status

1. **Go to Deployments tab**
2. **Check latest deployment:**
   - Status should be ✅ "Ready"
   - Commit should match your latest push
   - Build should have completed successfully

3. **If deployment failed:**
   - Click on it to see build logs
   - Look for errors

## Step 5: Test Database Connection Directly

If you have access to your Render database:

1. Go to Render Dashboard → Your PostgreSQL database
2. Click "Connect" → "psql"
3. Run: `SELECT COUNT(*) FROM leaderboard;`
4. If this works, the database is fine - issue is with the connection string

## Common Issues:

1. **Environment variable not set** → Add it in Vercel and redeploy
2. **Wrong database URL** → Use External Database URL for Vercel
3. **Didn't redeploy** → Adding env var doesn't auto-redeploy, must do it manually
4. **Database not accessible** → Check Render database is running
5. **SSL connection issues** → Code handles this, but check logs

## Quick Test:

After adding DATABASE_URL and redeploying:

1. Visit: `https://your-site.vercel.app/api/leaderboard`
2. Should see `[]` (empty array) - this means it's working!
3. If you see 503, check Vercel function logs for the exact error

