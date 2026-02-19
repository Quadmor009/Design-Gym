# Design Gym – Auth Setup Guide

Follow these steps to get Google Sign-In working.

---

## Step 1: Create Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one (top bar)
3. Go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User type: **External** (or Internal if it's a workspace)
   - App name: `Design Gym`
   - User support email: your email
   - Developer contact: your email
   - Save and continue
6. Back in **Create OAuth client ID**:
   - Application type: **Web application**
   - Name: `Design Gym Web`
   - **Authorized redirect URIs** → Add:
     - `http://localhost:3000/api/auth/callback/google` (local)
     - `https://yourdomain.com/api/auth/callback/google` (production)
7. Click **Create**
8. Copy the **Client ID** and **Client secret**

---

## Step 2: Create `.env.local`

In your project root, create or edit `.env.local`:

```bash
# Database (you likely already have this)
DATABASE_URL=postgresql://...

# NextAuth – required for sign-in
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-string-at-least-32-characters

# Google OAuth – paste from Step 1
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Generate `NEXTAUTH_SECRET`

Use one of these:

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Paste the result as `NEXTAUTH_SECRET`.

---

## Step 3: Run the database migration

Create the `users` and `streaks` tables:

```bash
npm run migrate:auth
```

---

## Step 4: Restart the dev server

After changing `.env.local`:

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

---

## Step 5: Test sign-in

1. Open http://localhost:3000
2. Click **Sign up**
3. Sign in with Google when prompted
4. You should land on the quiz page

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Configuration` | Check that `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` are set in `.env.local` and that you restarted the dev server. |
| `redirect_uri_mismatch` | In Google Console, ensure the redirect URI is exactly `http://localhost:3000/api/auth/callback/google` (no extra slash, http for local). Visit `/api/auth/oauth-check` for the exact value. |
| `AccessDenied` | You may have denied access or hit a consent screen issue. Try again in a private/incognito window. |
| Database errors on sign-in | Run `npm run migrate:auth` and confirm `DATABASE_URL` is correct. |

---

## Production (Vercel)

Add these as environment variables in your Vercel project:

- `NEXTAUTH_URL` = `https://yourdomain.com`
- `NEXTAUTH_SECRET` = same secret as local
- `GOOGLE_CLIENT_ID` = same client ID
- `GOOGLE_CLIENT_SECRET` = same client secret

Add `https://yourdomain.com/api/auth/callback/google` to your Google OAuth redirect URIs.
