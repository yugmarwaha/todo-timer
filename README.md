# Todo Timer App ⏰

A modern, productivity-focused web application that combines task management with timer-based time tracking and streak visualization to help you stay focused and organized.

## Features

### 🕒 Timer

- **Customizable Timer**: Set any duration from 1-60 minutes
- **Quick Presets**: Pre-configured timers for common intervals:
  - Quick (1 minute) ⚡
  - Break (5 minutes) ☕
  - Focus (25 minutes) 🎯
  - Deep Work (45 minutes) 🔥
- **Visual Progress**: Circular progress ring with smooth animations
- **Notifications**: Browser notifications when timer completes
- **Persistent Timer**: Timer continues running when navigating between pages
- **Dark Mode Support**: Seamless theme switching

### 📝 Todo List

- **Task Management**: Add, complete, and delete tasks
- **Progress Tracking**: Visual progress indicator showing completed vs total tasks
- **Organized Display**: Active and completed tasks shown separately
- **Persistent Storage**: Tasks are saved to localStorage and persist across sessions
- **Timer Integration**: View top 3 tasks alongside the timer for focused productivity

### 🔥 Streak Tracking

- **GitHub-Style Calendar**: Visual contribution calendar showing 365 days of activity
- **Daily Completions**: Automatically tracks completed timer sessions
- **Streak Statistics**:
  - Current streak (consecutive days)
  - Longest streak ever
  - Total completed sessions
- **Color Intensity**: Visual heat map showing activity levels (0, 1-2, 3-5, 6+ completions)
- **Persistent Data**: Streak data saved to localStorage

### 🌙 Dark Mode

- **Theme Toggle**: Switch between light and dark themes
- **Persistent Preference**: Your theme choice is saved locally
- **Consistent Design**: All components adapt to the selected theme

### 💡 Inspirational Quotes

- **Rotating Quotes**: Motivational quotes that change every 10 seconds
- **Curated Collection**: Hand-picked quotes from notable figures

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Routing**: React Router 7
- **Icons**: React Icons
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/CS571-F25/p207.git
cd p207-project
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `docs/` directory, ready for deployment to GitHub Pages.

### Deployment

This project is configured for deployment to GitHub Pages. The build output goes to the `docs/` folder and uses the base path `/p207/`.

## Usage

1. **Home Page**: View inspirational quotes and navigate to timer or todo features
2. **Timer Page**: Set your desired focus duration and start the timer. View your top 3 tasks alongside the timer.
3. **Todo Page**: Add tasks, mark them complete, and track your progress
4. **Streak Page**: View your GitHub-style contribution calendar and track your productivity streaks

## Architecture

The app uses React Context for global state management:

- **TimerContext**: Manages timer state that persists across navigation
- **TodoContext**: Manages todo list with localStorage persistence
- **StreakContext**: Tracks daily completions with localStorage persistence

Services are abstracted for future database migration:

- **streakService.js**: Handles streak data persistence (localStorage now, easily swappable to Firebase/Supabase)

## Browser Notifications

The timer feature uses browser notifications. When you first use the timer, your browser may ask for permission to show notifications. Granting permission will allow you to receive alerts when your timer completes.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of CS571 coursework.

## Acknowledgments

- Quotes sourced from various inspirational figures
- Built with modern React and Vite
- Styled with Bootstrap and custom CSS variables for theming
