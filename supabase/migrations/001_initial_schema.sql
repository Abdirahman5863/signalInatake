-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
-- Note: Supabase automatically creates auth.users table
-- We'll create a profiles table to store additional user adata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Intake forms table
CREATE TABLE IF NOT EXISTS intake_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  form_name TEXT NOT NULL,
  share_link TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Lead responses table
CREATE TABLE IF NOT EXISTS lead_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES intake_forms(id) ON DELETE CASCADE NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  answers JSONB NOT NULL,
  badge TEXT CHECK (badge IN ('Gold', 'Silver', 'Bronze')),
  badge_reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_intake_forms_user_id ON intake_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_intake_forms_share_link ON intake_forms(share_link);
CREATE INDEX IF NOT EXISTS idx_lead_responses_form_id ON lead_responses(form_id);
CREATE INDEX IF NOT EXISTS idx_lead_responses_badge ON lead_responses(badge);
CREATE INDEX IF NOT EXISTS idx_lead_responses_created_at ON lead_responses(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for intake_forms
CREATE POLICY "Users can view their own forms"
  ON intake_forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms"
  ON intake_forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
  ON intake_forms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
  ON intake_forms FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for lead_responses
CREATE POLICY "Users can view leads from their forms"
  ON lead_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM intake_forms
      WHERE intake_forms.id = lead_responses.form_id
      AND intake_forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create lead responses (public form submission)"
  ON lead_responses FOR INSERT
  WITH CHECK (true);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

