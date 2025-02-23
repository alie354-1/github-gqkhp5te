
-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS setup_progress jsonb DEFAULT '{}';

-- Create index for interests
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON profiles USING gin(interests);
