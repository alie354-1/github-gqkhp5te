
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Profiles (Users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'user',
  settings jsonb DEFAULT '{}',
  company_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  logo_url text,
  stage text DEFAULT 'concept',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Company Members
CREATE TABLE company_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Company Documents
CREATE TABLE company_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  file_url text,
  folder_path text,
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Company Stages
CREATE TABLE company_stages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  requirements jsonb DEFAULT '[]',
  resources jsonb DEFAULT '[]',
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Company Progress
CREATE TABLE company_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES company_stages(id) ON DELETE CASCADE,
  milestone text NOT NULL,
  status text DEFAULT 'pending',
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ideas
CREATE TABLE ideas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  stage text DEFAULT 'concept',
  problem_statement text,
  solution text,
  target_market text,
  business_model text,
  ai_feedback jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Standup Entries
CREATE TABLE standup_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  accomplished text,
  working_on text,
  blockers text,
  goals text,
  ai_feedback jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  standup_id uuid REFERENCES standup_entries(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  assigned_to uuid REFERENCES auth.users(id),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Communities
CREATE TABLE communities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  is_private boolean DEFAULT false,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community Members
CREATE TABLE community_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Community Posts
CREATE TABLE community_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community Comments
CREATE TABLE community_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feature Flags
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  enabled boolean DEFAULT false,
  conditions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE standup_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Company members can view company" ON companies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_members WHERE company_id = id AND user_id = auth.uid()
  )
);

CREATE POLICY "Company members can view documents" ON company_documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_members WHERE company_id = company_documents.company_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their ideas" ON ideas FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their ideas" ON ideas FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their standups" ON standup_entries FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their standups" ON standup_entries FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Company members can view tasks" ON tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM company_members WHERE company_id = tasks.company_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Community members can view posts" ON community_posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_members WHERE community_id = community_posts.community_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can read feature flags" ON feature_flags FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_company_members_company ON company_members(company_id);
CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_documents_company ON company_documents(company_id);
CREATE INDEX idx_stages_company ON company_stages(company_id);
CREATE INDEX idx_progress_company ON company_progress(company_id);
CREATE INDEX idx_ideas_user ON ideas(user_id);
CREATE INDEX idx_ideas_company ON ideas(company_id);
CREATE INDEX idx_standups_user ON standup_entries(user_id);
CREATE INDEX idx_standups_company ON standup_entries(company_id);
CREATE INDEX idx_tasks_company ON tasks(company_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_community_posts_community ON community_posts(community_id);
CREATE INDEX idx_community_comments_post ON community_comments(post_id);
