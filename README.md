# FocusFlow

A full-stack productivity app with user authentication, PostgreSQL database, and real-time analytics. Combines a drift-proof focus timer, task manager with time tracking, streak visualization, and an analytics dashboard.

**Live:** Deployed on Vercel

## Features

- **Focus Timer** — Deadline-based countdown immune to browser tab throttling. SVG circular progress ring, 4 presets, audio notification on completion.
- **Task Manager** — Full CRUD with time tracking per task. Tasks linked to timer sessions accumulate focus time automatically. Supports **subtasks** — expandable checklists within each task with progress tracking.
- **Task-Timer Linking** — Select a task before starting a session. On completion, one atomic API call logs the session, increments the streak, and updates the task's time.
- **Streak Tracker** — GitHub-style 365-day contribution calendar with 4-level heat map and streak statistics.
- **Analytics Dashboard** — Daily/weekly charts, time-per-task distribution, completion rates, session history. Lazy-loaded with Recharts.
- **Authentication** — Custom auth built from scratch: bcrypt password hashing, JWT in httpOnly secure cookies. Multi-user with data isolation.
- **Dark Mode** — 68 CSS variables powering seamless light/dark theme. Glassmorphism design system, zero CSS frameworks.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Recharts |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | PostgreSQL (Supabase) |
| Auth | bcrypt + JWT + httpOnly cookies (custom, no auth libraries) |
| Styling | Custom CSS with CSS variables (no frameworks) |
| Build | Vite 7 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js v18+
- A Supabase account (free tier) for PostgreSQL
- Vercel account for deployment

### 1. Clone and install

```bash
git clone <your-repo-url>
cd todo-timer
npm install
```

### 2. Set up the database

Create a Supabase project. In the SQL Editor, run:

```sql
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  password        TEXT NOT NULL,
  active_todo_id  INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE todos (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text                TEXT NOT NULL,
  completed           BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  total_time_seconds  INTEGER DEFAULT 0
);

CREATE TABLE sessions (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  todo_id           INTEGER REFERENCES todos(id) ON DELETE SET NULL,
  duration_seconds  INTEGER NOT NULL,
  completed_at      TIMESTAMPTZ DEFAULT NOW(),
  date              DATE DEFAULT CURRENT_DATE
);

CREATE TABLE streaks (
  id        SERIAL PRIMARY KEY,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  count     INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE TABLE subtasks (
  id              SERIAL PRIMARY KEY,
  todo_id         INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  completed       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_todos_user ON todos(user_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_streaks_user_date ON streaks(user_id, date);
CREATE INDEX idx_subtasks_todo_id ON subtasks(todo_id);
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
JWT_SECRET=<run: openssl rand -hex 32>
```

Use the **Transaction** mode connection string (port 6543) from Supabase > Settings > Database > Connection string.

If your password contains special characters (`#`, `&`, `?`, etc.), URL-encode it first.

### 4. Run locally

Open two terminals:

```bash
# Terminal 1: API server
npm run dev:api

# Terminal 2: Frontend (Vite)
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` requests to the API server on port 3001.

### 5. Deploy to Vercel

Set `DATABASE_URL` and `JWT_SECRET` in Vercel > Project Settings > Environment Variables. Push to GitHub — Vercel auto-deploys.

## Architecture

```
React Frontend (Vite)
  ├── AuthContext     → checks httpOnly cookie on load
  ├── TimerContext    → deadline-based countdown
  ├── StreakContext   → fetches from GET /api/streaks
  ├── SessionContext  → orchestrates timer completion
  └── TodoContext     → CRUD via /api/todos, subtask CRUD via /api/todos/:id/subtasks

Vercel Serverless Functions (/api)
  ├── auth/           → register, login, logout, me
  ├── todos/          → CRUD endpoints
  ├── sessions/       → GET sessions
  ├── streaks/        → GET streaks
  ├── timer/complete  → atomic: session + streak + todo (Postgres transaction)
  └── active-task     → GET/PUT active task

PostgreSQL (Supabase)
  └── users, todos, subtasks, sessions, streaks tables
```

**Timer completion flow:** Timer finishes → `POST /api/timer/complete` → single Postgres transaction creates session, upserts streak, updates task time → response updates 3 React contexts via callback refs.

## Project Structure

```
api/                        Vercel serverless functions
├── _db.js                  Postgres connection pool
├── _auth.js                JWT + cookie helpers
├── auth/                   register, login, logout, me
├── todos/                  CRUD (index.js + [id].js + [id]/subtasks/)
├── sessions/index.js       GET sessions
├── streaks/index.js        GET streaks
├── timer/complete.js       Atomic completion endpoint
└── active-task.js          GET/PUT active task

src/
├── components/             Timer, TaskSelector, TodoList, Quotes, DarkModeToggle
├── context/                AuthContext, TimerContext, SessionContext, StreakContext, TodoContext
├── pages/                  Home, Timer, Todo, Streak, Analytics, Login, Register
├── services/               api.js, streakService.js, analyticsService.js
├── assets/sound/           Westminster chimes audio
├── index.css               CSS variables, theme, animations
└── App.css                 Component styles, navbar, layout
```

## Acknowledgments

- Westminster chimes audio from Freesound.org (nightcustard)
- Built with React, Vite, Recharts, and PostgreSQL
