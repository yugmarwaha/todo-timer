import { useState } from "react";
import { Routes, Route, NavLink } from "react-router";
import { FiClock, FiHome, FiCheckSquare, FiTrendingUp, FiMenu, FiX } from "react-icons/fi";
import Home from "./pages/Home";
import TimerPage from "./pages/TimerPage";
import TodoPage from "./pages/TodoPage";
import StreakPage from "./pages/StreakPage";
import DarkModeToggle from "./components/DarkModeToggle";
import { TimerProvider } from "./context/TimerContext";
import { TodoProvider } from "./context/TodoContext";
import { StreakProvider } from "./context/StreakContext";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <TimerProvider>
      <StreakProvider>
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
                </div>
                <div className="navbar-actions">
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/streak" element={<StreakPage />} />
          </Routes>
        </TodoProvider>
      </StreakProvider>
    </TimerProvider>
  );
}

export default App;
