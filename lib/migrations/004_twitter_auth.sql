-- Support Twitter as auth provider (no email from Twitter OAuth 2.0)
-- Make email nullable for Twitter users
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Allow multiple users with null email (drop unique so we can have Twitter users)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Add twitter_handle for display (optional)
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter_handle VARCHAR(255);
