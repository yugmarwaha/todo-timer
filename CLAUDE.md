# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (http://localhost:5173)
- `npm run build` — Production build (outputs to `docs/` for GitHub Pages with base `/p207/`)
- `npm run lint` — ESLint (flat config, ESLint 9)
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

React 19 SPA with Vite 7, React Router 7, and no CSS framework. All JavaScript (no TypeScript). Deployed to Vercel (SPA rewrites in `vercel.json`).

### Context Provider Nesting (in App.jsx)

```
TimerProvider → StreakProvider → TodoProvider → Routes
```

Nesting order matters: StreakProvider registers a callback on TimerContext via `setOnTimerComplete()`, so TimerProvider must wrap StreakProvider.

### Cross-Context Communication

Timer completion triggers streak increment through a **callback ref pattern**: TimerContext holds a module-level `onTimerCompleteCallback` variable. StreakContext registers/unregisters via `setOnTimerComplete()` on mount/unmount. This avoids circular dependencies between contexts.

### Persistence

| Context | localStorage Key | Notes |
|---------|-----------------|-------|
| TodoContext | `todo-timer-app-todos` | Auto-saves on every state change |
| StreakContext | `streakData` | Date-keyed `{YYYY-MM-DD: count}` |
| DarkModeToggle | `theme` | `"dark"` or absent |
| TimerContext | *not persisted* | Resets on page refresh |

All localStorage access is wrapped in try/catch with fallback defaults. The `streakService.js` service layer abstracts streak persistence (designed to be swappable to a backend).

### Routes

- `/` — Home (hero, feature cards, quotes)
- `/timer` — Timer + top 3 tasks sidebar + quotes
- `/todo` — Task manager
- `/streak` — GitHub-style 365-day contribution calendar

### Styling

Custom CSS with 20+ CSS variables in `src/index.css`. Dark mode via `[data-theme="dark"]` attribute on `<html>`. Glassmorphism effects (backdrop-filter blur). Fonts loaded from Google Fonts: Inter (body) and JetBrains Mono (timer display). Icons from `react-icons` (Feather set).

### Key Patterns

- **Custom hooks** (`useTimer`, `useTodo`, `useStreak`) throw if used outside their provider
- **Timer**: SVG circular progress ring using stroke-dasharray/dashoffset; editable h:m:s inputs with bounds validation; Westminster chime audio on completion managed via Audio() ref
- **Streak calendar**: 365-day grid with 4-tier heat map (0, 1-2, 3-5, 6+); current streak counts consecutive days backward from today
- **TodoContext** exposes `getTopTasks(n)` used by TimerPage for the sidebar