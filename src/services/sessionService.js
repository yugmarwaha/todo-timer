const SESSIONS_KEY = "todo-timer-sessions";
const ACTIVE_TASK_KEY = "todo-timer-active-task";

export function loadSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

export function saveSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save sessions:", error);
  }
}

export function loadActiveTask() {
  try {
    const stored = localStorage.getItem(ACTIVE_TASK_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load active task:", error);
    return null;
  }
}

export function saveActiveTask(taskId) {
  try {
    localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(taskId));
  } catch (error) {
    console.error("Failed to save active task:", error);
  }
}
