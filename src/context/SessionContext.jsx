import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loadSessions,
  saveSessions,
  loadActiveTask,
  saveActiveTask,
} from "../services/sessionService";
import { setOnSessionComplete } from "./TimerContext";

const SessionContext = createContext(null);

// Callback ref for TodoContext to register
let onSessionLoggedCallback = null;

export function setOnSessionLogged(callback) {
  onSessionLoggedCallback = callback;
}

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeTaskId, setActiveTaskIdState] = useState(() => loadActiveTask());

  // Persist sessions
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Persist active task
  useEffect(() => {
    saveActiveTask(activeTaskId);
  }, [activeTaskId]);

  const setActiveTask = useCallback((taskId) => {
    setActiveTaskIdState(taskId);
  }, []);

  const clearActiveTask = useCallback(() => {
    setActiveTaskIdState(null);
  }, []);

  const logSession = useCallback(
    (durationSeconds) => {
      const now = Date.now();
      const date = new Date(now).toISOString().split("T")[0];
      const session = {
        id: now,
        taskId: activeTaskId,
        durationSeconds,
        completedAt: now,
        date,
      };
      setSessions((prev) => [...prev, session]);

      // Notify TodoContext to update task time
      if (onSessionLoggedCallback && activeTaskId) {
        onSessionLoggedCallback(activeTaskId, durationSeconds);
      }
    },
    [activeTaskId]
  );

  // Register on TimerContext for session logging on completion
  useEffect(() => {
    setOnSessionComplete((durationSeconds) => {
      logSession(durationSeconds);
    });
    return () => setOnSessionComplete(null);
  }, [logSession]);

  const value = {
    sessions,
    activeTaskId,
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
