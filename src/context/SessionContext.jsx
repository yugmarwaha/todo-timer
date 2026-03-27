import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { api } from "../services/api";
import { setOnSessionComplete } from "./TimerContext";
import { setOnTodoUpdate } from "./TodoContext";

const SessionContext = createContext(null);

// Callback ref for StreakContext to receive updates from timer completion
let onStreakUpdateCallback = null;

export function setOnStreakUpdate(callback) {
  onStreakUpdateCallback = callback;
}

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [activeTaskId, setActiveTaskIdState] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLogging = useRef(false);

  // Fetch sessions and active task from API on mount
  useEffect(() => {
    Promise.all([api("/sessions"), api("/active-task")])
      .then(([sessionsData, activeData]) => {
        setSessions(sessionsData.sessions);
        setActiveTaskIdState(activeData.todoId);
      })
      .catch((err) => console.error("Failed to load session data:", err))
      .finally(() => setLoading(false));
  }, []);

  const setActiveTask = useCallback(async (taskId) => {
    setActiveTaskIdState(taskId);
    try {
      await api("/active-task", {
        method: "PUT",
        body: JSON.stringify({ todoId: taskId }),
      });
    } catch (err) {
      console.error("Failed to set active task:", err);
    }
  }, []);

  const clearActiveTask = useCallback(async () => {
    setActiveTaskIdState(null);
    try {
      await api("/active-task", {
        method: "PUT",
        body: JSON.stringify({ todoId: null }),
      });
    } catch (err) {
      console.error("Failed to clear active task:", err);
    }
  }, []);

  // Timer completion orchestrator — single API call updates session + streak + todo
  const logTimerCompletion = useCallback(
    async (durationSeconds) => {
      if (isLogging.current) return;
      isLogging.current = true;

      try {
        const data = await api("/timer/complete", {
          method: "POST",
          body: JSON.stringify({
            todoId: activeTaskId,
            durationSeconds,
          }),
        });

        // Update sessions state
        setSessions((prev) => [data.session, ...prev]);

        // Push streak update to StreakContext
        if (onStreakUpdateCallback && data.streak) {
          onStreakUpdateCallback(data.streak);
        }

        // Push todo update to TodoContext
        if (onTodoUpdateCallback && data.todo) {
          onTodoUpdateCallback(data.todo);
        }
      } catch (err) {
        console.error("Failed to log timer completion:", err);
      } finally {
        isLogging.current = false;
      }
    },
    [activeTaskId]
  );

  // Register on TimerContext for completion callback
  useEffect(() => {
    setOnSessionComplete((durationSeconds) => {
      logTimerCompletion(durationSeconds);
    });
    return () => setOnSessionComplete(null);
  }, [logTimerCompletion]);

  const value = {
    sessions,
    activeTaskId,
    loading,
    setActiveTask,
    clearActiveTask,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export default SessionContext;
