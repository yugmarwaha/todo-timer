import { useNavigate } from "react-router";
import { FiPlay, FiCheckSquare, FiClock, FiTrendingUp } from "react-icons/fi";
import Quotes from "../components/Quotes";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        {/* Hero */}
        <div className="page-header">
          <h1>
            Focus. Track. Grow.
          </h1>
          <p>
            A simple productivity timer paired with task management and streak
            tracking to help you stay consistent.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button className="btn-accent d-flex align-items-center gap-2" onClick={() => navigate("/timer")}>
            <FiPlay size={18} />
            Start Timer
          </button>
          <button className="btn-ghost d-flex align-items-center gap-2" onClick={() => navigate("/todo")}>
            <FiCheckSquare size={18} />
            View Tasks
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid-3 mb-5">
          <div
            className="card-modern text-center p-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/timer")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span style={{ 
                width: 50, height: 50, 
                background: 'var(--accent-subtle)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <FiClock size={24} />
              </span>
            </div>
            <h3 className="mb-2" style={{ fontSize: "1.25rem" }}>
              Focus Timer
            </h3>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Customizable countdown with presets for focused work sessions.
            </p>
          </div>

          <div
            className="card-modern text-center p-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/todo")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span style={{ 
                width: 50, height: 50, 
                background: 'var(--success-subtle)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--success)'
              }}>
                <FiCheckSquare size={24} />
              </span>
            </div>
            <h3 className="mb-2" style={{ fontSize: "1.25rem" }}>
              Task Manager
            </h3>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Create, edit, and track your tasks with progress overview.
            </p>
          </div>

          <div
            className="card-modern text-center p-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/streak")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span style={{ 
                width: 50, height: 50, 
                background: 'var(--danger-subtle)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--danger)' // Using danger color for streaks hotness
              }}>
                <FiTrendingUp size={24} />
              </span>
            </div>
            <h3 className="mb-2" style={{ fontSize: "1.25rem" }}>
              Streak Tracker
            </h3>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Visualize your consistency with a contribution calendar.
            </p>
          </div>
        </div>

        {/* Quote */}
        <Quotes />
      </div>
    </div>
  );
}

export default Home;
