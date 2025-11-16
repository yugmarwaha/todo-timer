import { Container, Row, Col, Navbar } from "react-bootstrap";
import Timer from "./components/Timer";
import TodoList from "./components/TodoList";
import Quotes from "./components/Quotes";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">
            <span style={{ fontSize: "1.5rem" }}>⏰</span> Todo Timer App
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container fluid className="min-vh-100 py-5">
        <Container>
          <div
            className="text-center mb-4 p-3 text-white header-gradient d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <h1 className="display-3 fw-bold mb-3">
              <span style={{ fontSize: "3rem" }}>⏰</span> Todo Timer App
            </h1>
            <p
              className="lead mb-0"
              style={{ fontSize: "1.2rem", opacity: 0.95 }}
            >
              Boost your productivity with focused time management
            </p>
          </div>

          {/* Dark mode toggle */}
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={toggleDarkMode}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Inspirational Quotes */}
          <Quotes />

          {/* Timer and Todo List Section */}
          <Row className="g-4">
            {/* Timer Section - Left */}
            <Col lg={5} md={12} className="mb-4 mb-lg-0">
              <Timer />
            </Col>

            {/* Todo List Section - Right */}
            <Col lg={7} md={12}>
              <TodoList />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default App;
