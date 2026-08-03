-- ============================================================
-- Baby Feeding Tracker — Supabase Migration
-- Run this script in the Supabase SQL Editor (or via CLI).
-- ============================================================

-- 1. Create the feedings table
create table if not exists feedings (
  id          uuid primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  amount_oz   numeric(5,2) not null check (amount_oz > 0),
  notes       text,
  created_at  timestamptz not null default now()
);

-- 2. Index for efficient daily lookups (calendar view)
create index if not exists idx_feedings_started_at
  on feedings (started_at desc);

-- 3. Row Level Security
--    Single-user app — allow all operations.
--    Tighten these policies if auth is added later.
alter table feedings enable row level security;

-- Allow anonymous / authenticated reads
create policy "Allow select for all"
  on feedings for select
  using (true);

-- Allow anonymous / authenticated inserts
create policy "Allow insert for all"
  on feedings for insert
  with check (true);

-- Allow anonymous / authenticated updates
create policy "Allow update for all"
  on feedings for update
  using (true)
  with check (true);

-- Allow anonymous / authenticated deletes
create policy "Allow delete for all"
  on feedings for delete
  using (true);
