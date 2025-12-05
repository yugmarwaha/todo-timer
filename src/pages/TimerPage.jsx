import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import Timer from "../components/Timer";
import Quotes from "../components/Quotes";
import { useTodo } from "../context/TodoContext";
import "./TimerPage.css";

function TimerPage() {
  const navigate = useNavigate();
  const { getTopTasks, toggleTodo, activeTodos } = useTodo();
  const topTasks = getTopTasks(3);

  return (
    <div className="timer-page" style={{ background: "var(--bg-primary)" }}>
      <Container>
        <div className="timer-hero">
          <h1 className="timer-title">
            <span className="timer-icon">⏰</span>
            Productivity Timer
          </h1>
          <Quotes />
        </div>

        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <div className="timer-container">
              <Timer showHero={true} />
            </div>
          </Col>

          <Col lg={4} md={8} className="mt-4 mt-lg-0">
            {/* Compact Task Summary */}
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: "20px",
                boxShadow: "var(--card-shadow)",
                padding: "1.5rem",
                height: "100%",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "var(--text-secondary)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  📋 Current Tasks
                </div>
                <button
                  onClick={() => navigate("/todo")}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "6px 12px",
                    background: "var(--accent-blue, #60A5FA)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(96, 165, 250, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Edit Tasks
                </button>
              </div>

              {/* Task List */}
              {topTasks.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 1rem",
                    background: "var(--input-bg)",
                    borderRadius: "12px",
                    border: "2px dashed var(--border-color)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    ✅
                  </div>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: "500",
                      margin: 0,
                      fontSize: "0.85rem",
                    }}
                  >
                    All tasks completed!
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {topTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        background: "var(--input-bg)",
                        borderRadius: "10px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTodo(task.id)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "var(--accent-blue, #60A5FA)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}

                  {/* Show remaining count if more than 3 */}
                  {activeTodos.length > 3 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      +{activeTodos.length - 3} more task
                      {activeTodos.length - 3 > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TimerPage;
