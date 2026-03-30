import { useState } from "react";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiPlus, FiList, FiClock, FiChevronRight } from "react-icons/fi";
import { useTodo } from "../context/TodoContext";
import { formatDuration } from "../services/analyticsService";

function TodoList() {
  const {
    activeTodos,
    completedTodos,
    completedCount,
    totalCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTodo();

  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [expandedTodos, setExpandedTodos] = useState(new Set());
  const [newSubtaskText, setNewSubtaskText] = useState({});

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo("");
    }
  };

  const handleEditClick = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      editTodo(editingId, editText);
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") handleSaveEdit();
    else if (e.key === "Escape") handleCancelEdit();
  };

  const toggleExpand = (todoId) => {
    setExpandedTodos((prev) => {
      const next = new Set(prev);
      if (next.has(todoId)) {
        next.delete(todoId);
      } else {
        next.add(todoId);
      }
      return next;
    });
  };

  const handleAddSubtask = (todoId) => {
    const text = newSubtaskText[todoId];
    if (text && text.trim()) {
      addSubtask(todoId, text);
      setNewSubtaskText((prev) => ({ ...prev, [todoId]: "" }));
    }
  };

  const renderTodoItem = (todo, isCompleted) => {
    const subtasks = todo.subtasks || [];
    const completedSubtasks = subtasks.filter((s) => s.completed).length;
    const hasSubtasks = subtasks.length > 0;
    const isExpanded = expandedTodos.has(todo.id);

    return (
      <div key={todo.id} className="mb-2">
        <div
          className="d-flex align-items-center gap-3"
          style={{
            padding: "0.75rem 1rem",
            background: "var(--input-bg)",
            borderRadius: isExpanded ? "12px 12px 0 0" : "12px",
            border: "1px solid var(--border-color)",
            borderBottom: isExpanded ? "none" : "1px solid var(--border-color)",
            opacity: isCompleted ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => toggleTodo(todo.id)}
            aria-label={`Mark ${todo.text} as ${isCompleted ? "incomplete" : "complete"}`}
            style={{
              width: 18,
              height: 18,
              cursor: "pointer",
              accentColor: "var(--accent)",
              flexShrink: 0,
            }}
          />

          {editingId === todo.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyPress}
              aria-label="Edit task text"
              className="input-modern"
              style={{ flex: 1, padding: "0.5rem 0.75rem", fontSize: "0.95rem" }}
              autoFocus
            />
          ) : (
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: isCompleted ? "line-through" : "none",
                  color: isCompleted ? "var(--text-muted)" : "var(--text-primary)",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {todo.text}
              </span>
              <div className="d-flex align-items-center gap-2" style={{ marginTop: "2px" }}>
                {todo.totalTimeSeconds > 0 && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      background: "var(--accent-subtle)",
                      padding: "1px 6px",
                      borderRadius: "99px",
                      fontWeight: 600,
                    }}
                  >
                    <FiClock size={10} />
                    {formatDuration(todo.totalTimeSeconds)}
                  </span>
                )}
                {hasSubtasks && (
                  <span className="subtask-progress">
                    {completedSubtasks}/{subtasks.length}
                  </span>
                )}
              </div>
            </div>
          )}

          {!isCompleted && editingId !== todo.id && (
            <button
              onClick={() => toggleExpand(todo.id)}
              className={`expand-toggle ${isExpanded ? "expand-toggle--open" : ""}`}
              aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
            >
              <FiChevronRight size={14} />
            </button>
          )}

          {editingId === todo.id ? (
            <>
              <button
                onClick={handleSaveEdit}
                aria-label="Save edit"
                className="btn-icon"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={handleCancelEdit}
                aria-label="Cancel edit"
                className="btn-icon"
                style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}
              >
                <FiX size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEditClick(todo.id, todo.text)}
                aria-label="Edit task"
                className="btn-icon"
                style={{ background: "var(--accent-subtle)", color: "var(--text-muted)" }}
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
                className="btn-icon"
                style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}
              >
                <FiTrash2 size={16} />
              </button>
            </>
          )}
        </div>

        {/* Subtask panel */}
        {!isCompleted && isExpanded && (
          <div
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border-color)",
              borderTop: "none",
              borderRadius: "0 0 12px 12px",
              padding: "0.5rem 1rem 0.75rem",
            }}
          >
            {subtasks.length > 0 && (
              <div className="subtask-list">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="subtask-item">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(todo.id, subtask.id, subtask.completed)}
                      aria-label={`Mark subtask "${subtask.text}" as ${subtask.completed ? "incomplete" : "complete"}`}
                      style={{
                        width: 14,
                        height: 14,
                        cursor: "pointer",
                        accentColor: "var(--accent)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className={`subtask-item__text ${subtask.completed ? "subtask-item__text--completed" : ""}`}
                    >
                      {subtask.text}
                    </span>
                    <button
                      onClick={() => deleteSubtask(todo.id, subtask.id)}
                      aria-label="Delete subtask"
                      className="btn-icon"
                      style={{
                        width: 32,
                        height: 32,
                        minWidth: 44,
                        minHeight: 44,
                        background: "transparent",
                        boxShadow: "none",
                        color: "var(--text-muted)",
                      }}
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask input */}
            <div className="subtask-add">
              <input
                type="text"
                value={newSubtaskText[todo.id] || ""}
                onChange={(e) =>
                  setNewSubtaskText((prev) => ({ ...prev, [todo.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask(todo.id);
                  }
                }}
                placeholder="Add subtask..."
                aria-label="Add subtask"
              />
              <button
                onClick={() => handleAddSubtask(todo.id)}
                className="btn-icon"
                style={{
                  width: 28,
                  height: 28,
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                  boxShadow: "none",
                }}
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card-modern p-4 d-flex flex-column fade-in" style={{ minHeight: '600px' }}>
      {/* Add Task Form */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="d-flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            aria-label="Add new task"
            className="input-modern"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn-accent d-flex align-items-center gap-2"
            style={{ whiteSpace: "nowrap" }}
          >
            <FiPlus size={18} />
            Add
          </button>
        </div>
      </form>

      {/* Progress */}
      <div
        className="mb-4 text-center d-flex align-items-center justify-content-center gap-2"
        style={{
          padding: "0.75rem",
          background: "var(--bg-primary)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}
      >
        <FiList size={16} className="text-muted" />
        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {completedCount} of {totalCount} tasks completed
          {totalCount > 0 && completedCount === totalCount && " — All done! 🎉"}
        </span>
      </div>

      {/* Task Lists */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div
            className="text-center py-5 d-flex flex-column align-items-center justify-content-center"
            style={{
              height: '100%',
              minHeight: '200px',
              border: "2px dashed var(--border-color)",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.02)"
            }}
          >
             <div style={{
                width: 60, height: 60,
                borderRadius: '50%',
                background: 'var(--accent-subtle)',
                color:'var(--accent)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                marginBottom: '1rem'
              }}>
                <FiList size={24}/>
              </div>
            <p className="text-muted fw-bold">
              No tasks yet. Add your first task above!
            </p>
          </div>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="mb-4">
                <div className="section-label mb-2 px-1">
                  Active ({activeTodos.length})
                </div>
                {activeTodos.map((todo) => renderTodoItem(todo, false))}
              </div>
            )}

            {completedTodos.length > 0 && (
              <div>
                <div className="section-label mb-2 px-1">
                  Completed ({completedTodos.length})
                </div>
                {completedTodos.map((todo) => renderTodoItem(todo, true))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TodoList;
