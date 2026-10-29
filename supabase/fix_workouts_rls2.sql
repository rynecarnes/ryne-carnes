-- Drop and recreate policies for workout tables
alter table workout_profile enable row level security;
drop policy if exists "Allow select for all" on workout_profile;
drop policy if exists "Allow insert for all" on workout_profile;
drop policy if exists "Allow update for all" on workout_profile;
drop policy if exists "Allow delete for all" on workout_profile;
drop policy if exists "Allow all select on workout_profile" on workout_profile;
drop policy if exists "Allow all insert on workout_profile" on workout_profile;
drop policy if exists "Allow all update on workout_profile" on workout_profile;
drop policy if exists "Allow all delete on workout_profile" on workout_profile;

create policy "workout_profile_all" on workout_profile for all using (true) with check (true);

alter table workout_completions enable row level security;
drop policy if exists "Allow select for all" on workout_completions;
drop policy if exists "Allow insert for all" on workout_completions;
drop policy if exists "Allow update for all" on workout_completions;
drop policy if exists "Allow delete for all" on workout_completions;
drop policy if exists "Allow all select on workout_completions" on workout_completions;
drop policy if exists "Allow all insert on workout_completions" on workout_completions;
drop policy if exists "Allow all update on workout_completions" on workout_completions;
drop policy if exists "Allow all delete on workout_completions" on workout_completions;

create policy "workout_completions_all" on workout_completions for all using (true) with check (true);
