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
  Vocabulary Review
- **Daily Notes** – a private, free-form notes box on every day
- **Team Wall** – a shared message board (under the Team tab) where the four
  learners can post encouragement, reminders, and study updates, with quick
  ❤️ 👏 🔥 reactions — synced across devices via Supabase (see setup below)
- **Team Progress** – see how all four learners are doing
- **Awards** – unlockable badges for streaks, XP milestones, and more
- **Profile** – edit your display name, switch users, reset your progress
- **English / Arabic** language switch with full RTL support
- **Light / Dark** mode

Every learner starts at 0 XP, 0 streak, 0 minutes, 0% progress, and Day 1.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Progress, tasks, and journal entries: client-side `localStorage` (no
  backend/database required)
- Team Wall: [Supabase](https://supabase.com) (Postgres + Realtime), with an
  automatic `localStorage` fallback if Supabase isn't configured

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Team Wall / Supabase Setup

The Team Wall needs a real shared backend so a message posted from one
person's phone shows up on everyone else's — `localStorage` alone can't do
that, since it never leaves the device it was written on. Without Supabase
configured, the Team Wall still works but falls back to `localStorage`
(same-device only, as before).

**1. Create a Supabase project**
Go to [supabase.com](https://supabase.com) → New project (free tier is fine).

**2. Create the `team_messages` table**
Open **SQL Editor** in your project, paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql) from this repo, and run it.
This creates the table, sets Row Level Security policies that allow the app
to read/write it with the public anon key, and enables Realtime so messages
appear live on other devices.

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
and the SQL policies allow any request to read/write the table. That's an
acceptable trade-off for a private four-person family app, but don't reuse
this exact setup for anything public-facing.

## Data & Privacy

Each learner's XP, streak, tasks, vocabulary journal, and notes are stored
in **that browser's `localStorage`** — there is no server-side database for
these. Because of this, "Team Progress" only sees data for learners who
have used the **same browser/device**. If each person uses their own
device, their individual progress stays private to that device.

The **Team Wall** is the exception: once Supabase is configured (see
above), Team Wall messages and reactions are shared through Supabase and
visible to all four learners regardless of device.

## Build

```bash
npm run build
npm run lint
```

## Deploy

This project deploys to [Vercel](https://vercel.com) with zero configuration.
Remember to add the Supabase environment variables (above) for the Team Wall
to sync across devices in production.
