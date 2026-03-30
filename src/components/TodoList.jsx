import { useState } from "react";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiPlus, FiList, FiClock } from "react-icons/fi";
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
  } = useTodo();

  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

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

  const renderTodoItem = (todo, isCompleted) => (
    <div
      key={todo.id}
      className={`todo-item d-flex align-items-center gap-3 mb-2 ${isCompleted ? "todo-item--completed" : ""}`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => toggleTodo(todo.id)}
        aria-label={`Mark ${todo.text} as ${isCompleted ? "incomplete" : "complete"}`}
        className="todo-checkbox"
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
          <span className={`todo-item__text ${isCompleted ? "todo-item__text--completed" : ""}`}>
            {todo.text}
          </span>
          {todo.totalTimeSeconds > 0 && (
            <span className="todo-item__time-badge">
              <FiClock size={10} />
              {formatDuration(todo.totalTimeSeconds)}
            </span>
          )}
        </div>
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
  );

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
      <div className="progress-bar-wrapper mb-4 text-center d-flex align-items-center justify-content-center gap-2">
        <FiList size={16} className="text-muted" />
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          {completedCount} of {totalCount} tasks completed
          {totalCount > 0 && completedCount === totalCount && " — All done! 🎉"}
        </span>
      </div>

      {/* Task Lists */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div className="empty-state" style={{ height: '100%' }}>
            <div className="icon-badge--lg" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', marginBottom: '1rem' }}>
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
