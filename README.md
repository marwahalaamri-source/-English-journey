# English Journey

A private, mobile-first daily English learning planner built for four learners:
Marwah, Ebtehal, Meead, and Fatimah.

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
  ❤️ 👏 🔥 reactions
- **Team Progress** – see how all four learners are doing
- **Awards** – unlockable badges for streaks, XP milestones, and more
- **Profile** – edit your display name, switch users, reset your progress
- **English / Arabic** language switch with full RTL support
- **Light / Dark** mode

Every learner starts at 0 XP, 0 streak, 0 minutes, 0% progress, and Day 1.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Client-side persistence via `localStorage` (no backend/database required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data & Privacy

This app stores each learner's progress in the browser's `localStorage` —
there is no server-side database. Because of this, "Team Progress" only sees
data for learners who have used the **same browser/device**. If each person
uses their own device, individual progress will stay private to that device
and won't show up on others' Team Progress view.

## Build

```bash
npm run build
npm run lint
```

## Deploy

This project deploys to [Vercel](https://vercel.com) with zero configuration.
