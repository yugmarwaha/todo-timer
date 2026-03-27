import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../services/api";

const TodoContext = createContext(null);

// Callback ref for SessionContext to push todo updates from timer completion
let onTodoUpdateCallback = null;

export function setOnTodoUpdate(callback) {
  onTodoUpdateCallback = callback;
}

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos from API on mount
  useEffect(() => {
    api("/todos")
      .then((data) => setTodos(data.todos))
      .catch((err) => console.error("Failed to load todos:", err))
      .finally(() => setLoading(false));
  }, []);

  // Register callback for receiving todo updates from timer completion
  const updateTodoFromServer = useCallback((updatedTodo) => {
    if (updatedTodo) {
      setTodos((prev) =>
        prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      );
    }
  }, []);

  useEffect(() => {
    setOnTodoUpdate(updateTodoFromServer);
    return () => setOnTodoUpdate(null);
  }, [updateTodoFromServer]);

  const addTodo = useCallback(async (text) => {
    if (!text.trim()) return;
    try {
      const data = await api("/todos", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setTodos((prev) => [...prev, data.todo]);
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  }, []);

  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const data = await api(`/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !todo.completed }),
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id) => {
    try {
      await api(`/todos/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  }, []);

  const editTodo = useCallback(async (id, newText) => {
    if (!newText.trim()) return;
    try {
      const data = await api(`/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ text: newText }),
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
    } catch (err) {
      console.error("Failed to edit todo:", err);
    }
  }, []);

  // Derived state
  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  const completedCount = completedTodos.length;
  const totalCount = todos.length;

  const getTopTasks = useCallback(
    (n = 3) => {
      return [...activeTodos]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(0, n);
    },
    [activeTodos]
  );

  const value = {
    todos,
    activeTodos,
    completedTodos,
    completedCount,
    totalCount,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    getTopTasks,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}

export default TodoContext;
