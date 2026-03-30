import { useNavigate } from "react-router";
import { FiEdit3, FiCheck, FiClock } from "react-icons/fi";
import { useTodo } from "../context/TodoContext";
import { useSession } from "../context/SessionContext";
import { useTimer } from "../context/TimerContext";
import { formatDuration } from "../services/analyticsService";

function TaskSelector() {
  const navigate = useNavigate();
  const { activeTodos } = useTodo();
  const { activeTaskId, setActiveTask, clearActiveTask } = useSession();
  const { isRunning } = useTimer();

  const handleTaskClick = (taskId) => {
    if (activeTaskId === taskId) {
      clearActiveTask();
    } else {
      setActiveTask(taskId);
    }
  };

  return (
    <div className="card-modern p-4">
      <div
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <span className="section-label">
          {activeTaskId ? "Working On" : "Select a Task"}
        </span>
        <button
          className="btn-ghost d-flex align-items-center gap-1"
          onClick={() => navigate("/todo")}
          style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}
        >
          <FiEdit3 size={14} />
          Edit
        </button>
      </div>

      {activeTodos.length === 0 ? (
        <div
          className="text-center py-5 d-flex flex-column align-items-center justify-content-center"
          style={{
            background: "var(--input-bg)",
            borderRadius: "16px",
            border: "2px dashed var(--border-color)",
            minHeight: "160px",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--success-subtle)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <FiCheck size={20} />
          </div>
          <p className="text-muted fw-500 m-0">All set! No pending tasks.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {activeTodos.map((task) => {
            const isSelected = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTaskClick(task.id);
                  }
                }}
                aria-label={`${isSelected ? "Deselect" : "Select"} task: ${task.text}`}
                aria-pressed={isSelected}
                style={{
                  padding: "0.75rem 1rem",
                  background: isSelected
                    ? "var(--accent-subtle)"
                    : "var(--bg-primary)",
                  borderRadius: "12px",
                  border: isSelected
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border-color)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: isSelected
                      ? "2px solid var(--accent)"
                      : "2px solid var(--border-color)",
                    background: isSelected ? "var(--accent)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "white",
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: "0.95rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      color: "var(--text-primary)",
                    }}
                  >
                    {task.text}
                  </span>
                  <div className="d-flex align-items-center gap-2" style={{ marginTop: "2px" }}>
                    {task.totalTimeSeconds > 0 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <FiClock size={11} />
                        {formatDuration(task.totalTimeSeconds)}
                      </span>
                    )}
                    {task.subtasks?.length > 0 && (
                      <span className="subtask-progress">
                        {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && isRunning && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--success)",
                      animation: "pulse-dot 1.5s infinite",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskSelector;
