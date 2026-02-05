import { useNavigate } from "react-router";
import { FiEdit3 } from "react-icons/fi";
import Timer from "../components/Timer";
import Quotes from "../components/Quotes";
import { useTodo } from "../context/TodoContext";

function TimerPage() {
  const navigate = useNavigate();
  const { getTopTasks, toggleTodo, activeTodos } = useTodo();
  const topTasks = getTopTasks(3);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>Productivity Timer</h1>
          <p>Set a timer and stay focused on what matters.</p>
        </div>

        <div className="timer-layout">
          <div>
            <Timer />
            <div className="mt-3">
              <Quotes />
            </div>
          </div>

          <div>
            {/* Task Summary Sidebar */}
            <div className="card-modern" style={{ padding: "1.5rem" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="section-label">Current Tasks</span>
                <button
                  className="btn-accent d-flex align-items-center gap-1"
                  onClick={() => navigate("/todo")}
                  style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem" }}
                >
                  <FiEdit3 size={12} />
                  Edit
                </button>
              </div>

              {topTasks.length === 0 ? (
                <div
                  className="text-center py-4"
                  style={{
                    background: "var(--input-bg)",
                    borderRadius: "10px",
                    border: "1px dashed var(--border-color)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 500,
                      margin: 0,
                      fontSize: "0.85rem",
                    }}
                  >
                    All tasks completed!
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {topTasks.map((task) => (
                    <div
                      key={task.id}
                      className="d-flex align-items-center gap-2"
                      style={{
                        padding: "0.625rem 0.75rem",
                        background: "var(--input-bg)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTodo(task.id)}
                        aria-label={`Toggle task: ${task.text}`}
                        style={{
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                          accentColor: "var(--accent)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "var(--text-primary)",
                        }}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}

                  {activeTodos.length > 3 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "0.375rem",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      +{activeTodos.length - 3} more task
                      {activeTodos.length - 3 > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
