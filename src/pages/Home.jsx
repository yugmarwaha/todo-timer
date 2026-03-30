import { useNavigate } from "react-router";
import { FiPlay, FiCheckSquare, FiClock, FiTrendingUp, FiBarChart2 } from "react-icons/fi";
import Quotes from "../components/Quotes";

function Home() {
  const navigate = useNavigate();

  const cardProps = (path) => ({
    role: "button",
    tabIndex: 0,
    onClick: () => navigate(path),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate(path);
      }
    },
  });

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
            className="card-modern card-modern--clickable text-center p-4"
            {...cardProps("/timer")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span className="icon-badge" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
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
            className="card-modern card-modern--clickable text-center p-4"
            {...cardProps("/todo")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span className="icon-badge" style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}>
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
            className="card-modern card-modern--clickable text-center p-4"
            {...cardProps("/streak")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span className="icon-badge" style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}>
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

          <div
            className="card-modern card-modern--clickable text-center p-4"
            {...cardProps("/analytics")}
          >
            <div className="mb-3 d-flex justify-content-center">
              <span className="icon-badge" style={{ background: 'var(--warning-subtle)', color: 'var(--warning)' }}>
                <FiBarChart2 size={24} />
              </span>
            </div>
            <h3 className="mb-2" style={{ fontSize: "1.25rem" }}>
              Analytics
            </h3>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Track productivity trends with charts and session insights.
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
