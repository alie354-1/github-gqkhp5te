
-- Add settings column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}';

-- Create index for settings column
CREATE INDEX IF NOT EXISTS idx_profiles_settings ON profiles USING gin(settings);
