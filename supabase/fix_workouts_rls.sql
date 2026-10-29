-- Drop and recreate policies for workout tables
drop policy if exists "Allow select for all" on workout_profile;
drop policy if exists "Allow insert for all" on workout_profile;
drop policy if exists "Allow update for all" on workout_profile;
drop policy if exists "Allow delete for all" on workout_profile;

drop policy if exists "Allow select for all" on workout_completions;
drop policy if exists "Allow insert for all" on workout_completions;
drop policy if exists "Allow update for all" on workout_completions;
drop policy if exists "Allow delete for all" on workout_completions;

-- Create permissive policies
create policy "Allow all select on workout_profile" on workout_profile for select using (true);
create policy "Allow all insert on workout_profile" on workout_profile for insert with check (true);
create policy "Allow all update on workout_profile" on workout_profile for update using (true);
create policy "Allow all delete on workout_profile" on workout_profile for delete using (true);

create policy "Allow all select on workout_completions" on workout_completions for select using (true);
create policy "Allow all insert on workout_completions" on workout_completions for insert with check (true);
create policy "Allow all update on workout_completions" on workout_completions for update using (true);
create policy "Allow all delete on workout_completions" on workout_completions for delete using (true);
