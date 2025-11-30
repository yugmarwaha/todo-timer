import { Container, Navbar, Nav } from "react-bootstrap";
import { Routes, Route, NavLink } from "react-router";
import Home from "./pages/Home";
import TimerPage from "./pages/TimerPage";
import TodoPage from "./pages/TodoPage";
import "./App.css";

function App() {
  return (
    <>
      <Navbar
        expand="lg"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #E5E7EB",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <Navbar.Brand
          as={NavLink}
          to="/"
          style={{ fontWeight: "bold", marginRight: "24px" }}
        >
          <span style={{ fontSize: "1.5rem" }}>⏰</span> Todo Timer App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ gap: "24px" }}>
            <Nav.Link as={NavLink} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/timer" className="nav-link-custom">
              Timer
            </Nav.Link>
            <Nav.Link as={NavLink} to="/todo" className="nav-link-custom">
              Todo List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </>
  );
}

export default App;
