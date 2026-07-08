-- English Journey — Supabase schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

-- ── Team Wall ──────────────────────────────────────────────────────────
create table if not exists team_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  text text not null,
  created_at timestamptz not null default now(),
  heart_count integer not null default 0,
  clap_count integer not null default 0,
  fire_count integer not null default 0
);

alter table team_messages enable row level security;

create policy "Public can read team messages"
  on team_messages for select
  using (true);

create policy "Public can post team messages"
  on team_messages for insert
  with check (true);

create policy "Public can react to team messages"
  on team_messages for update
  using (true)
  with check (true);

-- ── Vocabulary Journal + Daily Notes (per user, per course day) ────────
create table if not exists day_entries (
  user_id text not null,
  day integer not null,
  vocab_words text not null default '',
  vocab_example text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table day_entries enable row level security;

create policy "Public can read day entries"
  on day_entries for select
  using (true);

create policy "Public can upsert day entries"
  on day_entries for insert
  with check (true);

create policy "Public can update day entries"
  on day_entries for update
  using (true)
  with check (true);

-- ── Task progress (per user: tasks completed, XP, streak history) ─────
create table if not exists user_progress (
  user_id text primary key,
  history jsonb not null default '{}'::jsonb,
  unlocked_achievements jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table user_progress enable row level security;

create policy "Public can read user progress"
  on user_progress for select
  using (true);

create policy "Public can upsert user progress"
  on user_progress for insert
  with check (true);

create policy "Public can update user progress"
  on user_progress for update
  using (true)
  with check (true);

-- Row Level Security note: this app has no server-side auth (it's a
-- shared profile picker, not a login system), so the anon key is used
-- directly from the browser and these policies allow any request to
-- read/write all three tables. That's an acceptable trade-off for a
-- private four-person family app, but don't reuse this exact setup for
-- anything public-facing.

-- ── Realtime ────────────────────────────────────────────────────────────
-- Lets posts/reactions/notes/vocab edits/task completions from one device
-- show up live on everyone else's screen without a manual refresh.
-- Equivalent to ticking all three tables on: Dashboard -> Database ->
-- Replication -> supabase_realtime.
alter publication supabase_realtime add table team_messages;
alter publication supabase_realtime add table day_entries;
alter publication supabase_realtime add table user_progress;
