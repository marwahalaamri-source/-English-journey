-- English Journey — migration 003: merge stray "miad" rows into "meead"
--
-- Miad's canonical user_id has always been "meead" (kept unchanged from
-- before she was renamed from "Meead" to "Miad", so existing localStorage/
-- Supabase data wouldn't break). The app code has always written "meead"
-- consistently — but Supabase's Row Level Security policies allow any
-- user_id string to be inserted, so a row hand-typed into the Table Editor
-- (where only the display name "Miad" is visible, not the internal id)
-- could easily end up saved as "miad" instead. That stray row then reads
-- as a second, unrecognized profile instead of merging into the one real
-- Miad — which is what you're seeing.
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste this
-- whole file -> Run.
--
-- Safe to run more than once: every statement below only affects rows
-- that still need fixing, so re-running it after it's already cleaned
-- everything up is a harmless no-op.

-- Step 1 — inspect first (optional, just for your own visibility). Run
-- this block alone if you want to see what's about to change before
-- continuing:
--
-- select * from user_progress where lower(user_id) not in ('marwah','ebtehal','meead','fatimah');
-- select * from day_entries where lower(user_id) not in ('marwah','ebtehal','meead','fatimah');
-- select * from team_messages where lower(user_id) not in ('marwah','ebtehal','meead','fatimah');

-- Step 2 — user_progress (XP / streak / completed tasks / Team Progress).
-- One row per user_id (primary key), so if both "meead" and a stray
-- "miad" row exist, merge them by keeping whichever was updated more
-- recently, then remove the stray row.
insert into user_progress (user_id, history, unlocked_achievements, updated_at)
select 'meead', history, unlocked_achievements, updated_at
from user_progress
where lower(user_id) = 'miad'
on conflict (user_id) do update
  set history = excluded.history,
      unlocked_achievements = excluded.unlocked_achievements,
      updated_at = excluded.updated_at
  where excluded.updated_at > user_progress.updated_at;

delete from user_progress where lower(user_id) = 'miad';

-- Step 3 — day_entries (Vocabulary Journal + Daily Notes). Primary key is
-- (user_id, day), so a stray "miad" row for the same day as an existing
-- "meead" row would collide — merge those per day, keeping whichever is
-- newer, before removing the stray rows.
insert into day_entries (user_id, day, vocab_words, vocab_example, notes, updated_at)
select 'meead', day, vocab_words, vocab_example, notes, updated_at
from day_entries
where lower(user_id) = 'miad'
on conflict (user_id, day) do update
  set vocab_words = excluded.vocab_words,
      vocab_example = excluded.vocab_example,
      notes = excluded.notes,
      updated_at = excluded.updated_at
  where excluded.updated_at > day_entries.updated_at;

delete from day_entries where lower(user_id) = 'miad';

-- Step 4 — team_messages (Team Wall). Each message is its own row (no
-- per-user uniqueness constraint), so this is a plain rename — no merge
-- needed, nothing to collide with.
update team_messages set user_id = 'meead' where lower(user_id) = 'miad';
