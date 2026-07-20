-- ─────────────────────────────────────────────────────────────────────────────
-- Ripple Platform — Supabase Schema
-- Run this entire script in your Supabase project:
--   Supabase Dashboard → SQL Editor → New query → paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. IDEAS table  (entire Idea object stored as JSONB for zero-migration schema evolution)
CREATE TABLE IF NOT EXISTS public.ideas (
  id          TEXT        PRIMARY KEY,
  data        JSONB       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. NOTIFICATIONS table  (flat columns so recipient filtering is cheap)
CREATE TABLE IF NOT EXISTS public.notifications (
  id              TEXT        PRIMARY KEY,
  idea_id         TEXT        NOT NULL DEFAULT 'GENERAL',
  recipient       TEXT        NOT NULL,
  subject         TEXT        NOT NULL,
  body            TEXT        NOT NULL,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attachment_name TEXT,
  attachment_type TEXT
);

-- Migration: add timestamp column to existing deployments that were created
-- before this column was introduced (CREATE TABLE IF NOT EXISTS skips existing tables).
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 3. MEETINGS table  (full meeting object as JSONB)
CREATE TABLE IF NOT EXISTS public.meetings (
  id          TEXT        PRIMARY KEY,
  data        JSONB       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Enable Realtime broadcasts for all three tables
-- (Supabase Dashboard → Database → Replication → enable these tables too)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.ideas         REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.meetings      REPLICA IDENTITY FULL;

-- Publication (only needed if not already added via the Dashboard)
-- If you get an error that "supabase_realtime" already exists, skip this block.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'ideas'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'meetings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security  (keep tables open for the demo — lock down in production)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.ideas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings      ENABLE ROW LEVEL SECURITY;

-- Allow anon + authenticated to read/write everything (demo policy)
CREATE POLICY "open_access_ideas"
  ON public.ideas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "open_access_notifications"
  ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "open_access_meetings"
  ON public.meetings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. USERS table  (self-registered employees)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT        UNIQUE NOT NULL,
  password      TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'Employee',
  business_unit TEXT        NOT NULL DEFAULT '',
  employee_id   TEXT        NOT NULL DEFAULT '',
  department    TEXT        NOT NULL DEFAULT '',
  designation   TEXT        NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_access_users"
  ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
