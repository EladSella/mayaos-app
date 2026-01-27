-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table (Stored from Google Drive)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  web_view_link TEXT NOT NULL,
  icon_link TEXT,
  created_time TIMESTAMP WITH TIME ZONE,
  modified_time TIMESTAMP WITH TIME ZONE,
  
  -- Content
  raw_text TEXT, -- For debugging/re-indexing
  
  -- Search Vectors
  embedding vector(1536), -- Assuming OpenAI ada-002 model dimension
  fts_content tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || COALESCE(raw_text, ''))) STORED,
  
  -- Access Control (Simplified for V1)
  drive_id TEXT, -- Shared Drive ID
  owner_email TEXT,
  
  indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for Vector Search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Index for Full Text Search
CREATE INDEX documents_fts_idx ON documents USING GIN (fts_content);

-- Live Feed Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('BIRTHDAY', 'CELEBRATION', 'HR', 'OPS')),
  title TEXT NOT NULL,
  body TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visibility TEXT DEFAULT 'all', -- 'all', 'group:eng', etc.
  meta JSONB DEFAULT '{}'::jsonb -- Stores icon override, specific links, etc.
);

-- Seed Data (Example)
INSERT INTO events (type, title, body, timestamp) VALUES
('BIRTHDAY', 'Sarah''s Birthday', 'Wish Sarah (Design) a happy birthday today! 🎂', NOW()),
('OPS', 'Office WiFi Maintenance', 'Network downtime expected from 6pm-7pm.', NOW());
