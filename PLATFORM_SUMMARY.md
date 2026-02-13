# Design Gym Platform - Comprehensive Summary

## Overview
Design Gym is a web-based design judgment training platform where designers practice and improve their visual design evaluation skills through a structured quiz system. The platform tests users' ability to evaluate interfaces and visual design choices, progressing through beginner, intermediate, and expert difficulty levels in a single session.

## Core Concept
- **Purpose**: Help designers train their visual judgment through comparative design questions
- **Format**: Side-by-side image comparisons (interface designs or typeface choices)
- **Progression**: All games go through all three difficulty levels (beginner → mid → expert) in sequence
- **Philosophy**: Minimal, editorial UI with calm presentation - no gamification, confetti, or excessive animations

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Backend
- **Database**: PostgreSQL (hosted on Render)
- **ORM/Client**: `pg` (node-postgres)
- **API**: Next.js API Routes

### Key Dependencies
- `next`: ^14.0.0
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `pg`: ^8.11.3 (PostgreSQL client)
- `tailwindcss`: ^3.3.5
- `@vercel/analytics`: ^1.1.1

---

## Application Structure

### Pages
1. **`/` (index.tsx)** - Landing page
   - Hero section with scrolling image collage
   - Social proof section showing real Twitter handles from players
   - Call-to-action to start training
   - Displays "110+ designers already training" with rotating Twitter handles

2. **`/quiz`** - Quiz entry point
   - Redirects to `/QuizContent` (main quiz component)

3. **`/QuizContent`** - Main quiz game component
   - Handles entire quiz flow
   - Name and Twitter handle input modal at start
   - Question display and answer selection
   - Score tracking and submission
   - Completion modal with results

4. **`/leaderboard`** - Global leaderboard
   - Shows all players ranked by score
   - Displays: Rank, Name, Twitter Handle, Score, Accuracy, Time
   - Highlights current user's entry
   - Clickable names link to personal stats

5. **`/stats`** - Personal progress dashboard
   - User statistics page (accessed via `/stats?name=YourName` or `/stats?twitter=YourHandle`)
   - Shows: Total sessions, Personal best, Average accuracy, Average time
   - Accuracy trend chart (last 10 sessions)
   - Recent sessions table

### API Endpoints

1. **`/api/leaderboard`** (GET, POST)
   - GET: Returns leaderboard entries sorted by score (descending)
   - POST: Submits new leaderboard entry
   - Query param: `level=global` (all games are global/all levels)
   - Returns entries with: id, name, score, accuracy, timeTaken, timestamp, twitterHandle

2. **`/api/user-stats`** (GET)
   - Returns personal statistics for a user
   - Query params: `name=YourName` or `twitterHandle=YourHandle`
   - Returns: totalSessions, personalBestScore, averageAccuracy, averageTime, accuracyTrend, recentSessions

3. **`/api/twitter-handles`** (GET)
   - Returns unique Twitter handles from leaderboard for social proof
   - Returns array of handles (e.g., ["@handle1", "@handle2"])
   - Used by landing page to display real player handles

4. **`/api/health`** (GET)
   - Health check endpoint
   - Checks database connection status
   - Returns diagnostic information

5. **`/api/check-env`** (GET)
   - Debug endpoint to verify DATABASE_URL is set
   - Returns environment variable status

6. **`/api/test-db`** (GET)
   - Simple database connection test
   - Returns current database time if connected

---

## Database Schema

### Table: `leaderboard`
```sql
CREATE TABLE leaderboard (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  accuracy DECIMAL(5, 2) NOT NULL,
  time_taken INTEGER NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'mid', 'expert', 'all')),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  twitter_handle VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_leaderboard_level ON leaderboard(level);
CREATE INDEX idx_leaderboard_ranking ON leaderboard(score DESC, accuracy DESC, time_taken ASC);
CREATE INDEX idx_leaderboard_twitter ON leaderboard(twitter_handle) WHERE twitter_handle IS NOT NULL;
```

**Note**: All games are stored with `level='all'` since every game goes through all three difficulty levels.

---

## Quiz System

### Question Structure
Each question in `data/quizData.ts` has:
```typescript
{
  id: string
  difficulty: "beginner" | "mid" | "expert"
  type: "image" | "typeface"
  prompt: string
  optionA: string (image path)
  optionB: string (image path)
  correctOption: "A" | "B"
  explanation: string
}
```

### Question Selection Logic
- **Total questions per game**: 20 (5 beginner + 7 mid + 8 expert)
- **Selection process**:
  1. Questions filtered by explicit `difficulty` field
  2. Validated to ensure proper image/typeface composition per level
  3. Shuffled within each difficulty level
  4. Selected randomly from each level pool
  5. Presented in order: beginner → mid → expert

### Question Pool Composition
- **Beginner**: 15 image questions, 5 typeface questions (20 total)
- **Mid**: 12 image questions, 8 typeface questions (20 total)
- **Expert**: 13 image questions, 7 typeface questions (20 total)

### Answer Options
- Options are shuffled at render time (A/B positions randomized)
- Correct answer position is tracked
- User selects left or right image
- Immediate feedback shows correct answer and explanation

---

## Scoring System

### Points Calculation
- **Each correct answer**: 100 points
- **No partial credit**: Binary correct/incorrect
- **No negative scoring**: Wrong answers = 0 points
- **Maximum possible score**: 2000 points (20 questions × 100 points)

### Accuracy Calculation
- `accuracy = (score / totalPossiblePoints) × 100`
- Rounded to 2 decimal places for display
- Used for leaderboard ranking (secondary to score)

### Feedback System
Based on accuracy percentage:
- **80%+**: "Strong"
- **50-79%**: "Solid"
- **Below 50%**: "Needs practice"

### Score Display
- Shown only after completing all questions
- Format: `{score} / {totalPossiblePoints}`
- Includes accuracy percentage
- Includes qualitative feedback
- Includes time taken

---

## User Flow

### Starting a Quiz
1. User visits landing page (`/`)
2. Clicks "Start Training" → redirects to `/quiz`
3. Modal appears asking for:
   - **Name** (required)
   - **Twitter Handle** (optional, with @ prefix shown in input)
4. User enters info and clicks "Start Training"

### During Quiz
1. Questions presented one at a time
2. Two images shown side-by-side
3. User clicks left or right to select
4. Immediate feedback:
   - Correct/incorrect indicator
   - Explanation text
   - "Next Question" button appears
5. Score tracked silently (not shown during quiz)
6. Progresses through: 5 beginner → 7 mid → 8 expert questions

### After Quiz Completion
1. Completion modal appears showing:
   - Final score and accuracy
   - Feedback message
   - Time taken
   - Share tone selector (Humble/Brag)
2. Actions available:
   - **View Your Stats** (primary button) → `/stats?name=...`
   - **View Leaderboard** → `/leaderboard`
   - **Share on X** → Opens Twitter with pre-filled tweet
   - **Start Over** → Resets and starts new quiz

### Leaderboard Submission
- Automatically submitted when quiz completes
- Uses name and Twitter handle (if provided)
- Calculates: score, accuracy, timeTaken
- Stores timestamp for sorting
- Entry ID stored in `sessionStorage` for highlighting user's entry

---

## Social Features

### Twitter Integration
- **Optional Twitter handle** collection at quiz start
- Handles stored with `@` prefix in database
- **Social proof on landing page**:
  - Fetches real Twitter handles from database
  - Rotates through handles every 2 seconds
  - Shows "Be the first to connect your Twitter!" if none exist
- **Leaderboard display**:
  - Twitter handles shown as clickable links next to names
  - Links to `https://twitter.com/{handle}`
- **Twitter sharing**:
  - Pre-filled tweet with score and accuracy
  - Two tone options: "Humble" or "Brag"
  - Includes link to platform

---

## Personal Progress Dashboard

### Access
- Via quiz completion modal: "View Your Stats" button
- Via leaderboard: Click on your own name
- Direct URL: `/stats?name=YourName` or `/stats?twitter=YourHandle`

### Statistics Displayed
1. **Key Metrics Grid**:
   - Total Sessions
   - Personal Best Score
   - Average Accuracy
   - Average Time

2. **Accuracy Trend Chart**:
   - Last 10 sessions visualized
   - Bar chart showing accuracy percentage
   - Session numbers and dates

3. **Recent Sessions Table**:
   - Last 5 sessions
   - Columns: Date, Score, Accuracy, Time
   - Color-coded accuracy (green ≥80%, orange ≥50%, red <50%)

### Data Aggregation
- All statistics calculated from leaderboard entries
- Identifies user by name or Twitter handle
- Trends calculated from most recent entries
- Averages computed across all user's sessions

---

## UI/UX Design Philosophy

### Design Principles
- **Minimal and editorial**: Clean, uncluttered interface
- **Calm presentation**: No excessive animations or gamification
- **Professional tone**: Encouraging but neutral feedback
- **Focus on learning**: Explanations are educational, not judgmental

### Visual Style
- **Color palette**: Primarily black, white, gray with minimal accent colors
- **Typography**: Clean, readable fonts
- **Spacing**: Generous whitespace
- **Rounded corners**: Consistent use of rounded-[8px] and rounded-[2rem]
- **No emojis**: Text-only feedback
- **No confetti/animations**: Subtle transitions only

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly button sizes
- Optimized image display for mobile

---

## Environment Configuration

### Required Environment Variables
- **`DATABASE_URL`**: PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Required for leaderboard and stats functionality
  - Must be set in `.env.local` for local development
  - Must be set in Vercel environment variables for production

### Database Setup
1. Create PostgreSQL database (Render recommended)
2. Copy External Database URL
3. Add to `.env.local`: `DATABASE_URL=postgresql://...`
4. Run migration: `npm run migrate`
5. Run Twitter migration: `npm run migrate:twitter`

---

## File Structure

```
/
├── pages/
│   ├── index.tsx              # Landing page
│   ├── quiz.tsx              # Quiz entry point
│   ├── QuizContent.tsx        # Main quiz component
│   ├── leaderboard.tsx        # Leaderboard page
│   ├── stats.tsx              # Personal stats page
│   ├── _app.tsx               # Next.js app wrapper
│   ├── _document.tsx          # Next.js document
│   ├── _error.tsx              # Error page
│   └── api/
│       ├── leaderboard.ts     # Leaderboard API
│       ├── user-stats.ts      # User stats API
│       ├── twitter-handles.ts # Twitter handles API
│       ├── health.ts          # Health check
│       ├── check-env.ts       # Env check
│       └── test-db.ts         # DB test
├── data/
│   └── quizData.ts            # Question data (60 questions)
├── lib/
│   ├── db.ts                  # Database connection pool
│   └── migrations/
│       ├── 001_create_leaderboard.sql
│       ├── 002_add_twitter_handle.sql
│       ├── run-migration.js
│       └── run-migration-002.js
├── public/                     # Static assets (images)
├── styles/
│   └── globals.css            # Global styles
├── .env.local                  # Local environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## Key Features

### Current Features
1. ✅ Multi-level quiz system (beginner → mid → expert)
2. ✅ Question randomization within difficulty levels
3. ✅ Score tracking and leaderboard
4. ✅ Personal progress dashboard
5. ✅ Twitter handle integration
6. ✅ Social proof on landing page
7. ✅ Twitter sharing
8. ✅ Responsive design
9. ✅ Database persistence
10. ✅ User statistics and trends

### Design Decisions
- **No user accounts**: Identified by name or Twitter handle
- **Session-based**: Uses `sessionStorage` to track current user
- **Global leaderboard**: No level filtering (all games are all-level)
- **Simple scoring**: Binary correct/incorrect, no partial credit
- **Educational focus**: Explanations teach design principles
- **Social proof**: Real Twitter handles build trust

---

## Deployment

### Production Setup
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Database**: Render PostgreSQL
- **Environment**: Set `DATABASE_URL` in Vercel dashboard
- **Migrations**: Run manually on production database

### Migration Scripts
- `npm run migrate`: Creates leaderboard table
- `npm run migrate:twitter`: Adds twitter_handle column
- Or use `run-production-migration.js` with connection string

---

## Development Workflow

### Local Development
1. Clone repository
2. Install: `npm install`
3. Create `.env.local` with `DATABASE_URL`
4. Run migrations: `npm run migrate && npm run migrate:twitter`
5. Start dev server: `npm run dev`
6. Open: `http://localhost:3000`

### Testing
- Test quiz flow end-to-end
- Verify leaderboard submission
- Check stats page with real data
- Test Twitter handle collection and display
- Verify social proof on landing page

---

## Future Enhancement Ideas
(From UPGRADE_SUGGESTIONS.md)
- Streak tracking
- Practice history with question review
- Question categories breakdown
- Mobile optimization improvements
- Practice mode (no scoring)
- Personal best badges
- Difficulty recommendations
- Export/share personal stats
- Time-based challenges

---

## Important Notes

1. **All games are "all levels"**: Every quiz goes through beginner, mid, and expert. There's no separate level filtering.

2. **Question randomization**: Questions are shuffled within each difficulty level, but levels are always presented in order.

3. **Scoring is simple**: 100 points per correct answer, no complexity.

4. **Twitter handles are optional**: Users can skip Twitter handle, but it enables social proof and sharing.

5. **No authentication**: Users identified by name or Twitter handle. No login system.

6. **Database required**: Leaderboard and stats won't work without PostgreSQL connection.

7. **Vercel deployment**: Automatic from GitHub main branch. Must set `DATABASE_URL` in Vercel environment variables.

---

## Contact & Support
- Platform: Design Gym
- Purpose: Design judgment training for designers
- Tech Stack: Next.js + PostgreSQL + Vercel + Render

