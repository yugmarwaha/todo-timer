import { useState } from "react";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { useTodo } from "../context/TodoContext";

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
      className="d-flex align-items-center gap-3"
      style={{
        padding: "0.75rem 1rem",
        marginBottom: "0.5rem",
        background: "var(--input-bg)",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
        opacity: isCompleted ? 0.6 : 1,
        transition: "all 0.15s ease",
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
        <span
          style={{
            flex: 1,
            fontWeight: 500,
            fontSize: "0.95rem",
            textDecoration: isCompleted ? "line-through" : "none",
            color: isCompleted ? "var(--text-muted)" : "var(--text-primary)",
          }}
        >
          {todo.text}
        </span>
      )}

      {editingId === todo.id ? (
        <>
          <button
            onClick={handleSaveEdit}
            aria-label="Save edit"
            className="btn-icon"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <FiCheck size={15} />
          </button>
          <button
            onClick={handleCancelEdit}
            aria-label="Cancel edit"
            className="btn-icon"
            style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}
          >
            <FiX size={15} />
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
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            aria-label="Delete task"
            className="btn-icon"
            style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}
          >
            <FiTrash2 size={14} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div
      className="card-modern"
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
            className="btn-accent d-flex align-items-center gap-1"
            style={{ whiteSpace: "nowrap" }}
          >
            <FiPlus size={16} />
            Add
          </button>
        </div>
      </form>

      {/* Progress */}
      <div
        className="mb-3 text-center"
        style={{
          padding: "0.5rem 1rem",
          background: "var(--accent-subtle)",
          borderRadius: "8px",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {completedCount} of {totalCount} tasks completed
          {totalCount > 0 && completedCount === totalCount && " — all done!"}
        </span>
      </div>

      {/* Task Lists */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              background: "var(--input-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--border-color)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontWeight: 500,
                margin: 0,
                fontSize: "0.9rem",
              }}
            >
              No tasks yet. Add your first task above!
            </p>
          </div>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="mb-3">
                <div className="section-label mb-2" style={{ paddingLeft: 4 }}>
                  Active ({activeTodos.length})
                </div>
                {activeTodos.map((todo) => renderTodoItem(todo, false))}
              </div>
            )}

            {completedTodos.length > 0 && (
              <div>
                <div className="section-label mb-2" style={{ paddingLeft: 4 }}>
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
