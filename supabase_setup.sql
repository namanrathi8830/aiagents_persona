-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create personas table
CREATE TABLE IF NOT EXISTS personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  traits JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(user_id);

-- Optional: Enable Row Level Security (comment out if you want public access)
-- ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Optional: Create policy to allow service role access (if RLS is enabled)
-- CREATE POLICY "Service role can do everything" ON personas
--   FOR ALL USING (auth.role() = 'service_role');

