# Todo Timer App ⏰

A modern, productivity-focused web application that combines task management with timer-based time tracking and streak visualization to help you stay focused and organized.

## Features

### 🕒 Timer

- **Customizable Timer**: Set any duration from 1-60 minutes with hours, minutes, and seconds precision
- **Quick Presets**: Pre-configured timers for common intervals:
  - Quick (1 minute) ⚡
  - Break (5 minutes) ☕
  - Focus (25 minutes) 🎯
  - Deep Work (45 minutes) 🔥
- **Visual Progress**: Circular progress ring with smooth animations and color-coded time remaining
- **Audio Notifications**: Westminster chimes sound plays when timer completes
- **Sound Control**: Stop sound button appears when audio is playing, with automatic sound stopping on pause/reset/start
- **Persistent Timer**: Timer continues running when navigating between pages
- **Dark Mode Support**: Seamless theme switching with visual adaptations
- **Task Integration**: View your top 3 active tasks alongside the timer for focused productivity

### 📝 Todo List

- **Full CRUD Operations**: Add, complete, edit, and delete tasks with intuitive controls
- **Progress Tracking**: Visual progress indicator showing completed vs total tasks with percentage completion
- **Organized Display**: Active and completed tasks shown separately with clear visual distinction
- **Persistent Storage**: Tasks are saved to localStorage and persist across sessions
- **Task Statistics**: Real-time display of completed/total task counts
- **Timer Integration**: Top 3 tasks automatically displayed on timer page for productivity focus

### 🔥 Streak Tracking

- **GitHub-Style Calendar**: Visual contribution calendar showing 365 days of activity with heat map visualization
- **Daily Completions**: Automatically tracks completed timer sessions with streak incrementation
- **Streak Statistics**:
  - Current streak (consecutive days with at least one completion)
  - Longest streak ever achieved
  - Total completed sessions across all time
- **Color Intensity**: Visual heat map showing activity levels:
  - Light: 1-2 completions per day
  - Medium: 3-5 completions per day
  - High: 6+ completions per day
- **Persistent Data**: Streak data saved to localStorage with robust error handling

### 🌙 Dark Mode

- **Theme Toggle**: Smooth transition between light and dark themes with sun/moon icon
- **Persistent Preference**: Your theme choice is automatically saved and restored
- **Consistent Design**: All components adapt seamlessly to the selected theme with optimized colors
- **Glassmorphism Effects**: Enhanced visual effects in both light and dark modes

### 💡 Inspirational Quotes

- **Rotating Quotes**: Motivational quotes that change every 10 seconds
- **Curated Collection**: Hand-picked quotes from notable figures

## Tech Stack

- **Frontend**: React 19.1.1 with modern hooks and context API
- **Build Tool**: Vite 7.1.7 for fast development and optimized production builds
- **Styling**: Bootstrap 5.3.8 + Custom CSS with CSS variables for theming
- **Routing**: React Router 7.9.5 for client-side navigation
- **Icons**: React Icons 5.5.0 for consistent iconography
- **State Management**: React Context API with localStorage persistence
- **Deployment**: GitHub Pages with custom domain support

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
2. **Timer Page**: Set your desired focus duration and start the timer. View your top 3 tasks alongside the timer. Audio notification plays when timer completes with option to stop sound.
3. **Todo Page**: Add tasks, mark them complete, edit existing tasks, and track your progress with visual indicators
4. **Streak Page**: View your GitHub-style contribution calendar and track your productivity streaks with detailed statistics

## Architecture

The app uses React Context for global state management across four main contexts:

- **TimerContext**: Manages timer state with audio controls, persists across navigation, handles sound playback
- **TodoContext**: Manages todo list with localStorage persistence and CRUD operations
- **StreakContext**: Tracks daily completions with localStorage persistence and streak calculations
- **Theme Context**: Integrated into component state for dark mode management

Services are abstracted for future database migration:

- **streakService.js**: Handles streak data persistence (localStorage now, easily swappable to Firebase/Supabase)

## Audio Features

The timer includes audio notifications for completion:

- Westminster chimes sound plays automatically when timer finishes
- Red "🔇 STOP SOUND" button appears when sound is playing
- Sound automatically stops when starting new timer, pausing, or resetting
- Audio respects browser autoplay policies and user interaction requirements

## Browser Compatibility

- Modern browsers with ES6+ support
- Audio playback requires user interaction (clicking start) due to browser autoplay policies
- localStorage support for data persistence
- CSS Grid and Flexbox for responsive layouts
- Backdrop-filter support with fallbacks for older browsers

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Timer.jsx       # Main timer component with audio
│   ├── TodoList.jsx    # Todo management interface
│   ├── Quotes.jsx      # Inspirational quotes display
│   └── DarkModeToggle.jsx # Theme switching
├── context/            # React Context providers
│   ├── TimerContext.jsx # Timer state management
│   ├── TodoContext.jsx  # Todo state management
│   └── StreakContext.jsx # Streak tracking
├── pages/              # Route components
│   ├── Home.jsx        # Landing page
│   ├── TimerPage.jsx   # Timer interface
│   ├── TodoPage.jsx    # Todo management
│   └── StreakPage.jsx  # Streak visualization
├── services/           # Business logic abstraction
│   └── streakService.js # Streak data operations
└── assets/             # Static assets
    └── sound/          # Audio files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Westminster chimes audio from Freesound.org (nightcustard)
- Quotes sourced from various inspirational figures
- Built with modern React and Vite ecosystem
- Styled with Bootstrap and custom CSS variables for theming
- GitHub-style calendar inspired by contribution graphs
