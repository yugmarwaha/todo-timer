import { Container, Navbar, Nav } from "react-bootstrap";
import { Routes, Route, NavLink } from "react-router";
import { FiClock, FiHome, FiCheckSquare, FiTrendingUp } from "react-icons/fi";
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
  return (
    <TimerProvider>
      <StreakProvider>
        <TodoProvider>
          <Navbar expand="lg" className="navbar-custom sticky-top">
            <Container>
              <Navbar.Brand as={NavLink} to="/">
                <FiClock size={20} style={{ color: "var(--accent)" }} />
                <span>Todo Timer</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="main-nav" />
              <Navbar.Collapse id="main-nav">
                <Nav className="ms-auto d-flex align-items-center gap-1">
                  <Nav.Link as={NavLink} to="/" className="nav-link-custom">
                    <FiHome size={15} className="me-1" />
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/timer" className="nav-link-custom">
                    <FiClock size={15} className="me-1" />
                    Timer
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/todo" className="nav-link-custom">
                    <FiCheckSquare size={15} className="me-1" />
                    Tasks
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/streak" className="nav-link-custom">
                    <FiTrendingUp size={15} className="me-1" />
                    Streaks
                  </Nav.Link>
                  <div className="ms-3">
                    <DarkModeToggle />
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
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
