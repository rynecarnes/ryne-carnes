-- ============================================================
-- Workout Tracker — Supabase Migration
-- Brad Gillingham 12 Week Peaking Program (Bench & Squat)
-- ============================================================

-- 1. Create the workout profile table (stores 1RMs and progress)
create table if not exists workout_profile (
  id          uuid primary key default gen_random_uuid(),
  bench_1rm   numeric(6,2) not null check (bench_1rm > 0),
  squat_1rm   numeric(6,2) not null check (squat_1rm > 0),
  current_day_index integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Create workout completions table
create table if not exists workout_completions (
  id          uuid primary key default gen_random_uuid(),
  day_index   integer not null unique,
  completed_at timestamptz not null default now()
);

-- 3. Row Level Security
alter table workout_profile enable row level security;
alter table workout_completions enable row level security;

-- Allow all operations (single-user app pattern)
create policy "Allow select for all" on workout_profile for select using (true);
create policy "Allow insert for all" on workout_profile for insert with check (true);
create policy "Allow update for all" on workout_profile for update using (true) with check (true);
create policy "Allow delete for all" on workout_profile for delete using (true);

create policy "Allow select for all" on workout_completions for select using (true);
create policy "Allow insert for all" on workout_completions for insert with check (true);
create policy "Allow update for all" on workout_completions for update using (true) with check (true);
create policy "Allow delete for all" on workout_completions for delete using (true);
