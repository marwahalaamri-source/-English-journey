# English Journey

A private, mobile-first daily English learning planner built for four learners:
Marwah, Ebtehal, Miad, and Fatimah.

## Features

- **Home** – daily XP, streak, study time, and today's progress at a glance
- **Journey** – a self-paced 90-day curriculum split into three 30-day months
  (Foundation, Confidence, Fluency). Any day can be opened and completed in
  any order — nothing is locked.
- **Daily Tasks** (per day) – Listening, Vocabulary, Vocabulary Review,
  Grammar, Grammar Review, Reading, Speaking, AI Feedback, and optional
  Shadowing, each linking directly to its real resource
- **Vocabulary Journal** – write down each day's new words and an example
  sentence; shown again as "Yesterday's Words" during the next day's
  Vocabulary Review — synced across devices via Supabase (see setup below)
- **Daily Notes** – a private, free-form notes box on every day — synced
  across devices via Supabase
- **Team Wall** – a shared message board (under the Team tab) where the four
  learners can post encouragement, reminders, and study updates, with quick
  ❤️ 👏 🔥 reactions — synced across devices via Supabase
- **Team Progress** – see everyone's XP, streak, and today's completion
  live, synced across devices via Supabase
- **Awards** – unlockable badges for streaks, XP milestones, and more
- **Profile** – edit your display name, switch users, reset your progress
- **English / Arabic** language switch with full RTL support
- **Light / Dark** mode

Every learner starts at 0 XP, 0 streak, 0 minutes, 0% progress, and Day 1.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Progress, tasks, journal entries, and Team Wall: instant client-side
  `localStorage` write, plus [Supabase](https://supabase.com) (Postgres +
  Realtime) for cross-device sync — falls back to `localStorage`-only
  (same-device) if Supabase isn't configured

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup (cross-device sync)

Team Wall, Vocabulary Journal, Daily Notes, and Team Progress (XP/streak/
completion) all need a real shared backend so something done on one
person's phone shows up on everyone else's — `localStorage` alone can't do
that, since it never leaves the device it was written on. Without Supabase
configured, the app still works but falls back to `localStorage`
(same-device only, as before).

**1. Create a Supabase project**
Go to [supabase.com](https://supabase.com) → New project (free tier is fine).

**2. Create the tables**

- **Brand new Supabase project (nothing set up yet):** open **SQL Editor**
  in your project, paste the contents of
  [`supabase/schema.sql`](./supabase/schema.sql) from this repo, and run it.
- **Already set up `team_messages`/`day_entries` before and just need
  Team Progress sync:** open **SQL Editor**, paste the contents of
  [`supabase/migration_002_user_progress.sql`](./supabase/migration_002_user_progress.sql)
  instead, and run it. Running the full `schema.sql` again would error on
  the tables you already created.

Either way, this creates the `team_messages`, `day_entries`, and
`user_progress` tables, sets Row Level Security policies that allow the app
to read/write them with the public anon key, and enables Realtime so
changes appear live on other devices.

**3. Get your API keys**
Project Settings → API. You need:
- **Project URL**
- **anon / public key**

**4. Set environment variables**

Locally, copy `.env.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

On Vercel: Project → Settings → Environment Variables → add both of the
above (for Production, Preview, and Development), then redeploy.

**Security note:** this app has no login system (it's a shared family
device/profile picker), so the anon key is used directly from the browser
and the SQL policies allow any request to read/write the tables. That's an
acceptable trade-off for a private four-person family app, but don't reuse
this exact setup for anything public-facing.

## Data & Privacy

Each learner's XP, streak, tasks, vocabulary journal, and notes are always
written instantly to **that browser's `localStorage`** first, so the app
works offline and never waits on a network round trip.

When Supabase is configured (see above), the same data is also synced to
Supabase in the background, which is what lets:
- **Team Progress** show every learner's real XP, streak, and today's
  completion, live, regardless of device
- **Team Wall** messages/reactions appear on everyone's screen
- **Vocabulary Journal** and **Daily Notes** follow a learner between their
  own devices

Without Supabase configured, none of the above sync — "Team Progress" only
sees data for learners who have used the **same browser/device**, and
Team Wall/journal/notes stay local to that device, exactly as before.

## Build

```bash
npm run build
npm run lint
```

## Deploy

This project deploys to [Vercel](https://vercel.com) with zero configuration.
Remember to add the Supabase environment variables (above) so progress,
Team Wall, and journal/notes sync across devices in production.
