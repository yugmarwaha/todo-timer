import { Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import Quotes from "../components/Quotes";
import DarkModeToggle from "../components/DarkModeToggle";

function Home() {
  const navigate = useNavigate();

  const handleStartTimer = () => {
    navigate("/timer");
  };

  const handleViewTasks = () => {
    navigate("/todo");
  };

  return (
    <Container
      fluid
      className="min-vh-100 pb-5"
      style={{ background: "var(--bg-primary)" }}
    >
      <Container className="pt-5">
        <div
          className="text-center mb-4 p-3 d-flex flex-column justify-content-center align-items-center hero-card"
          style={{
            minHeight: "200px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            color: "#374151",
          }}
        >
          <h1 className="display-3 fw-bold mb-3">
            <span style={{ fontSize: "3rem" }}>⏰</span> Todo Timer App
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "1.2rem" }}>
            Boost your productivity with focused time management
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={handleStartTimer} className="start-timer-btn">
              <span>▶</span>
              Start Timer
            </button>
            <button onClick={handleViewTasks} className="view-tasks-btn">
              <span>☑</span>
              View Tasks
            </button>
          </div>
        </div>

        <DarkModeToggle />

        <Quotes />
      </Container>
    </Container>
  );
}

export default Home;
