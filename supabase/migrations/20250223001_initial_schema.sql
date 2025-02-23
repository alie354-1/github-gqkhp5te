
-- Drop existing tables if they exist
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS standup_tasks CASCADE;
DROP TABLE IF EXISTS standup_entries CASCADE;
DROP TABLE IF EXISTS company_documents CASCADE;
DROP TABLE IF EXISTS company_members CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table first since other tables reference it
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('user', 'admin', 'superadmin')),
  is_public boolean DEFAULT false,
  allows_messages boolean DEFAULT true,
  avatar_url text,
  professional_background text,
  skills text[],
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create other tables...
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industries text[] DEFAULT '{}',
  website text,
  size text,
  stage text,
  business_model text,
  target_market text,
  is_public boolean DEFAULT false,
  logo_url text,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create setup progress table
CREATE TABLE setup_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  step text NOT NULL,
  completed boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, step)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_progress ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_setup_progress_user ON setup_progress(user_id);

-- Create RLS policies
CREATE POLICY "Users can manage their own setup progress"
  ON setup_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create initial superadmin user
DO $$ 
DECLARE
  user_id uuid := gen_random_uuid();
BEGIN
  DELETE FROM auth.users WHERE email = 'alie@jointhewheel.com';
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    user_id,
    '00000000-0000-0000-0000-000000000000',
    'alie@jointhewheel.com',
    crypt('test123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Alie"}',
    'authenticated',
    'authenticated'
  );

  INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    is_public,
    allows_messages
  ) VALUES (
    user_id,
    'alie@jointhewheel.com',
    'Alie',
    'superadmin',
    true,
    true
  );
END $$;
