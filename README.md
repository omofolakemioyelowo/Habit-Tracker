# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js, React, TypeScript, and Tailwind CSS.

## Project Overview

Habit Tracker PWA allows users to:
- Sign up and log in with email/password
- Create, edit, and delete habits
- Mark habits complete for today
- View current streak for each habit
- Install the app as a PWA
- Work offline after initial load

## Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Persistence**: localStorage
- **Testing**: Vitest (unit/integration), Playwright (e2e)
- **PWA**: Service Worker + Manifest

## Setup Instructions

```bash
npm install
```

## Run Instructions

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Instructions

Run all tests:
```bash
npm run test
```

Run unit tests only:
```bash
npm run test:unit
```

Run integration tests only:
```bash
npm run test:integration
```

Run e2e tests only:
```bash
npm run test:e2e
```

## Local Persistence Structure

The app uses localStorage with these keys:

- `habit-tracker-users`: Array of user objects `{ id, email, password, createdAt }`
- `habit-tracker-session`: Current session `{ userId, email }` or `null`
- `habit-tracker-habits`: Array of habit objects `{ id, userId, name, description, frequency, createdAt, completions[] }`

## PWA Support

The app includes:
- `public/manifest.json`: App manifest for installation
- `public/sw.js`: Service worker for offline support
- `public/icons/192.png` and `512.png`: App icons

When installed, the app:
- Works offline (cached app shell)
- Shows as an installable PWA
- Launches in standalone mode

## Trade-offs and Limitations

- **Local-only auth**: No email verification, password reset, or social login
- **Single device**: No sync across devices
- **No backup**: Data can be lost if localStorage is cleared
- **Limited offline**: Only cached app shell works offline, not localStorage operations

## Test File Mapping

| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/unit/slug.test.ts` | `getHabitSlug` converts habit names to URL-friendly slugs |
| `tests/unit/validators.test.ts` | `validateHabitName` validates habit name input |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` calculates consecutive completion days |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` adds/removes completion dates |
| `tests/integration/auth-flow.test.tsx` | Signup, login, logout, error handling |
| `tests/integration/habit-form.test.tsx` | Create, edit, delete habits, confirm dialogs |
| `tests/e2e/app.spec.ts` | Full user flows: auth, habits, persistence, offline |