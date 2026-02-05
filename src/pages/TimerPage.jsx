import { useNavigate } from "react-router";
import { FiEdit3, FiCheck } from "react-icons/fi";
import Timer from "../components/Timer";
import Quotes from "../components/Quotes";
import { useTodo } from "../context/TodoContext";

function TimerPage() {
  const navigate = useNavigate();
  const { getTopTasks, toggleTodo, activeTodos } = useTodo();
  const topTasks = getTopTasks(3);

  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Productivity Timer</h1>
          <p>Set a timer and stay focused on what matters.</p>
        </div>

        <div className="timer-layout">
          <div>
            <Timer />
            <div className="mt-4">
              <Quotes />
            </div>
          </div>

          <div>
            {/* Task Summary Sidebar */}
            <div className="card-modern p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="section-label">Current Tasks</span>
                <button
                  className="btn-ghost d-flex align-items-center gap-1"
                  onClick={() => navigate("/todo")}
                  style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}
                >
                  <FiEdit3 size={14} />
                  Edit
                </button>
              </div>

              {topTasks.length === 0 ? (
                <div
                  className="text-center py-5 d-flex flex-column align-items-center justify-content-center"
                  style={{
                    background: "var(--input-bg)",
                    borderRadius: "16px",
                    border: "2px dashed var(--border-color)",
                    minHeight: "160px"
                  }}
                >
                   <div style={{
                     width: 40, height: 40, 
                     borderRadius: '50%', 
                     background: 'var(--success-subtle)', 
                     color:'var(--success)', 
                     display:'flex', 
                     alignItems:'center', 
                     justifyContent:'center',
                     marginBottom: '1rem'
                   }}>
                     <FiCheck size={20}/>
                   </div>
                  <p className="text-muted fw-500 m-0">
                    All set! No pending tasks.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {topTasks.map((task) => (
                    <div
                      key={task.id}
                      className="d-flex align-items-center gap-3"
                      style={{
                        padding: "0.75rem 1rem",
                        background: "var(--bg-primary)",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)",
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTodo(task.id)}
                        aria-label={`Toggle task: ${task.text}`}
                        style={{
                          width: 18,
                          height: 18,
                          cursor: "pointer",
                          accentColor: "var(--accent)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontWeight: 500,
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "var(--text-primary)",
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.6 : 1
                        }}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}

                  {activeTodos.length > 3 && (
                    <div
                      className="text-center mt-2"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
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
