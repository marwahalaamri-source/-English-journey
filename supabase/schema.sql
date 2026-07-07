-- English Journey — Team Wall schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

create table if not exists team_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  text text not null,
  created_at timestamptz not null default now(),
  heart_count integer not null default 0,
  clap_count integer not null default 0,
  fire_count integer not null default 0
);

-- Row Level Security: this app has no server-side auth (it's a shared
-- profile picker, not a login system), so the anon key is used directly
-- from the browser. These policies let anyone with that key read, post,
-- and react to messages — appropriate for a private family app, but do
-- not reuse this table/policy setup for anything public-facing.
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

-- Enable Realtime so posts/reactions from one device show up live on
-- everyone else's screen without a manual refresh:
-- Dashboard -> Database -> Replication -> add "team_messages" to the
-- supabase_realtime publication (or run the line below).
alter publication supabase_realtime add table team_messages;
