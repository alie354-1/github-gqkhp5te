
-- Add interests column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';

-- Create index for interests column
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON profiles USING gin(interests);
