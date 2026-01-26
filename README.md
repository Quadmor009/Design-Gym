# Design Quiz App

A simple design quiz web app built with Next.js and Tailwind CSS.

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database (required for leaderboard):**
   - See [RENDER_SETUP.md](./RENDER_SETUP.md) for detailed instructions
   - Create a `.env.local` file with your database connection:
     ```
     DATABASE_URL=postgresql://user:password@hostname:5432/database
     ```
   - Run the database migration:
     ```bash
     npm run migrate
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

## What You Need

- Node.js installed on your computer (version 18 or higher)
- npm (comes with Node.js)
- PostgreSQL database (see [RENDER_SETUP.md](./RENDER_SETUP.md) for Render setup)

