import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { setOnSessionLogged } from "./SessionContext";

const TodoContext = createContext(null);

const STORAGE_KEY = "todo-timer-app-todos";

const DEFAULT_TODOS = [
  {
    id: 1,
    text: "Create todo timer app",
    completed: false,
    createdAt: Date.now(),
    totalTimeSeconds: 0,
  },
  {
    id: 2,
    text: "Add timer functionality",
    completed: false,
    createdAt: Date.now() + 1,
    totalTimeSeconds: 0,
  },
  {
    id: 3,
    text: "Deploy to GitHub Pages",
    completed: false,
    createdAt: Date.now() + 2,
    totalTimeSeconds: 0,
  },
];

// Migrate old todos that lack totalTimeSeconds
function migrateTodos(todos) {
  return todos.map((t) => ({
    ...t,
    totalTimeSeconds: t.totalTimeSeconds || 0,
  }));
}

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return migrateTodos(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load todos from localStorage:", error);
    }
    return DEFAULT_TODOS;
  });

  // Persist to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error);
    }
  }, [todos]);

  const addTodo = useCallback((text) => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
        totalTimeSeconds: 0,
      };
      setTodos((prev) => [...prev, newTodo]);
    }
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const editTodo = useCallback((id, newText) => {
    if (newText.trim()) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, text: newText.trim() } : todo
        )
      );
    }
  }, []);

  const addTimeToTodo = useCallback((taskId, seconds) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === taskId
          ? { ...todo, totalTimeSeconds: (todo.totalTimeSeconds || 0) + seconds }
          : todo
      )
    );
  }, []);

  // Register callback for session logging
  useEffect(() => {
    setOnSessionLogged((taskId, seconds) => {
      addTimeToTodo(taskId, seconds);
    });
    return () => setOnSessionLogged(null);
  }, [addTimeToTodo]);

  // Derived state
  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  const completedCount = completedTodos.length;
  const totalCount = todos.length;

  // Get top N incomplete tasks (by creation order)
  const getTopTasks = useCallback(
    (n = 3) => {
      return activeTodos
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
        .slice(0, n);
    },
    [activeTodos]
  );

  const value = {
    // State
    todos,
    activeTodos,
    completedTodos,
    completedCount,
    totalCount,
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    addTimeToTodo,
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
