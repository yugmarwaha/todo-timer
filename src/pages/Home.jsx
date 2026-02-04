import { Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FiPlay, FiCheckSquare, FiClock, FiTrendingUp } from "react-icons/fi";
import Quotes from "../components/Quotes";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <Container style={{ maxWidth: 720 }}>
        {/* Hero */}
        <div
          className="page-header"
          style={{ marginTop: "3rem", marginBottom: "3rem" }}
        >
          <h1 style={{ fontSize: "2.75rem", fontWeight: 800 }}>
            Focus. Track. Grow.
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              maxWidth: 480,
              margin: "0.75rem auto 0",
              lineHeight: 1.6,
            }}
          >
            A simple productivity timer paired with task management and streak
            tracking to help you stay consistent.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button className="btn-accent d-flex align-items-center gap-2" onClick={() => navigate("/timer")}>
            <FiPlay size={16} />
            Start Timer
          </button>
          <button className="btn-ghost d-flex align-items-center gap-2" onClick={() => navigate("/todo")}>
            <FiCheckSquare size={16} />
            View Tasks
          </button>
        </div>

        {/* Feature cards */}
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <div
              className="card-modern text-center p-4"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/timer")}
            >
              <FiClock
                size={28}
                style={{ color: "var(--accent)", marginBottom: "0.75rem" }}
              />
              <h3 style={{ fontSize: "1rem", marginBottom: "0.375rem" }}>
                Focus Timer
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Customizable countdown with presets for focused work sessions.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card-modern text-center p-4"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/todo")}
            >
              <FiCheckSquare
                size={28}
                style={{ color: "var(--success)", marginBottom: "0.75rem" }}
              />
              <h3 style={{ fontSize: "1rem", marginBottom: "0.375rem" }}>
                Task Manager
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Create, edit, and track your tasks with progress overview.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card-modern text-center p-4"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/streak")}
            >
              <FiTrendingUp
                size={28}
                style={{ color: "var(--warning)", marginBottom: "0.75rem" }}
              />
              <h3 style={{ fontSize: "1rem", marginBottom: "0.375rem" }}>
                Streak Tracker
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Visualize your consistency with a contribution calendar.
              </p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <Quotes />
      </Container>
    </div>
  );
}

export default Home;
