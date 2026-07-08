-- English Journey — migration 002: user_progress table
-- Adds cross-device sync for XP / streak / completed tasks (Team Progress).
-- Safe to run even if you're not sure whether you've run it before — every
-- statement below is written to be a no-op the second time.
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste this
-- whole file -> Run.

create table if not exists user_progress (
  user_id text primary key,
  history jsonb not null default '{}'::jsonb,
  unlocked_achievements jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table user_progress enable row level security;

drop policy if exists "Public can read user progress" on user_progress;
create policy "Public can read user progress"
  on user_progress for select
  using (true);

drop policy if exists "Public can upsert user progress" on user_progress;
create policy "Public can upsert user progress"
  on user_progress for insert
  with check (true);

drop policy if exists "Public can update user progress" on user_progress;
create policy "Public can update user progress"
  on user_progress for update
  using (true)
  with check (true);

-- Enable Realtime on this table only if it isn't already on, so re-running
-- this script doesn't error with "table is already a member of publication".
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'user_progress'
  ) then
    alter publication supabase_realtime add table user_progress;
  end if;
end $$;
