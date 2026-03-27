import { useState, lazy, Suspense } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router";
import { FiClock, FiHome, FiCheckSquare, FiTrendingUp, FiBarChart2, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Home from "./pages/Home";
import TimerPage from "./pages/TimerPage";
import TodoPage from "./pages/TodoPage";
import StreakPage from "./pages/StreakPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
import DarkModeToggle from "./components/DarkModeToggle";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TimerProvider } from "./context/TimerContext";
import { TodoProvider } from "./context/TodoContext";
import { StreakProvider } from "./context/StreakContext";
import { SessionProvider } from "./context/SessionContext";
import "./App.css";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="page-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <FiClock size={40} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in — show auth routes only
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Logged in — show full app with data providers
  return (
    <TimerProvider>
      <StreakProvider>
        <SessionProvider>
          <TodoProvider>
            <nav className="navbar-glass">
              <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
                  <FiClock size={20} />
                  <span>Todo Timer</span>
                </NavLink>

                <button
                  className="navbar-toggle"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>

                <div className={`navbar-menu ${menuOpen ? "navbar-menu--open" : ""}`}>
                  <div className="navbar-links">
                    <NavLink to="/" end className="nav-pill" onClick={closeMenu}>
                      <FiHome size={15} />
                      <span>Home</span>
                    </NavLink>
                    <NavLink to="/timer" className="nav-pill" onClick={closeMenu}>
                      <FiClock size={15} />
                      <span>Timer</span>
                    </NavLink>
                    <NavLink to="/todo" className="nav-pill" onClick={closeMenu}>
                      <FiCheckSquare size={15} />
                      <span>Tasks</span>
                    </NavLink>
                    <NavLink to="/streak" className="nav-pill" onClick={closeMenu}>
                      <FiTrendingUp size={15} />
                      <span>Streaks</span>
                    </NavLink>
                    <NavLink to="/analytics" className="nav-pill" onClick={closeMenu}>
                      <FiBarChart2 size={15} />
                      <span>Analytics</span>
                    </NavLink>
                  </div>
                  <div className="navbar-actions">
                    <DarkModeToggle />
                    <button
                      onClick={() => { closeMenu(); logout(); }}
                      className="nav-pill"
                      title="Log out"
                      style={{ cursor: "pointer" }}
                    >
                      <FiLogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/todo" element={<TodoPage />} />
              <Route path="/streak" element={<StreakPage />} />
              <Route path="/analytics" element={
                <Suspense fallback={<div className="page-wrapper"><div className="container text-center" style={{ padding: "4rem 0" }}>Loading...</div></div>}>
                  <AnalyticsPage />
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TodoProvider>
        </SessionProvider>
      </StreakProvider>
    </TimerProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
