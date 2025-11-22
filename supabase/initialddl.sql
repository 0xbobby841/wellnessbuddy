-- Ensure pgcrypto is available for gen_random_uuid()
-- (Supabase typically has pgcrypto installed; adjust if you prefer uuid-ossp)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;


-- ----------------------------
-- profiles (app-level user data)
-- ----------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  -- email is stored for convenience; authoritative email remains in auth.users
  email citext,
  role text NOT NULL DEFAULT 'traveler',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT role_allowed CHECK (role IN ('traveler','moderator','admin'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);

-- Trigger to keep updated_at current on profiles
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------
-- goals
-- ----------------------------
CREATE TABLE IF NOT EXISTS goals (
  goal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  description text,
  target_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals (user_id);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals (category);

CREATE TRIGGER trg_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------
-- journal_entries
-- ----------------------------
CREATE TABLE IF NOT EXISTS journal_entries (
  entry_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  content text,
  mood_rating smallint CHECK (mood_rating IS NULL OR (mood_rating BETWEEN 1 AND 5)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_goal_id ON journal_entries (goal_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries (entry_date);

CREATE TRIGGER trg_journal_entries_updated_at
BEFORE UPDATE ON journal_entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------
-- posts
-- ----------------------------
CREATE TABLE IF NOT EXISTS posts (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_status_allowed CHECK (status IN ('pending','approved','rejected'))
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------
-- ai_recommendations
-- ----------------------------
CREATE TABLE IF NOT EXISTS ai_recommendations (
  recommendation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text,
  message text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_category ON ai_recommendations (category);

-- ----------------------------
-- clubs
-- ----------------------------
CREATE TABLE IF NOT EXISTS clubs (
  club_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clubs_category ON clubs (category);

-- ----------------------------
-- memberships
-- ----------------------------
CREATE TABLE IF NOT EXISTS memberships (
  membership_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id uuid NOT NULL REFERENCES clubs(club_id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_club_id ON memberships (club_id);

-- ----------------------------
-- contract_templates
-- ----------------------------
CREATE TABLE IF NOT EXISTS contract_templates (
  template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  category text,
  description text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contract_templates_creator_id ON contract_templates (creator_id);
CREATE INDEX IF NOT EXISTS idx_contract_templates_category ON contract_templates (category);

-- ----------------------------
-- expenses
-- ----------------------------
CREATE TABLE IF NOT EXISTS expenses (
  expense_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES goals(goal_id) ON DELETE SET NULL,
  category text,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  date date NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_goal_id ON expenses (goal_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (date);

CREATE TRIGGER trg_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();