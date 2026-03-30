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
      <div className="d-flex justify-content-between align-items-center mb-3">
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
        <div className="empty-state" style={{ minHeight: "160px" }}>
          <div className="icon-badge icon-badge--sm" style={{ background: "var(--success-subtle)", color: "var(--success)", marginBottom: "1rem" }}>
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
                className={`task-select-item ${isSelected ? "task-select-item--active" : ""}`}
              >
                <div className={`radio-dot ${isSelected ? "radio-dot--active" : ""}`}>
                  {isSelected && <div className="radio-dot__inner" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    className="todo-item__text"
                    style={{ fontWeight: isSelected ? 600 : 500 }}
                  >
                    {task.text}
                  </span>
                  {task.totalTimeSeconds > 0 && (
                    <span className="todo-item__time-badge">
                      <FiClock size={11} />
                      {formatDuration(task.totalTimeSeconds)}
                    </span>
                  )}
                </div>
                {isSelected && isRunning && <div className="live-dot" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskSelector;
