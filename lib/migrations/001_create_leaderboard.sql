-- Create leaderboard table
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

-- Create index for faster queries by level
CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON leaderboard(level);

-- Create index for sorting (score, accuracy, time_taken)
CREATE INDEX IF NOT EXISTS idx_leaderboard_ranking ON leaderboard(score DESC, accuracy DESC, time_taken ASC);

