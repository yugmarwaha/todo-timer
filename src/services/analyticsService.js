export function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return "0m";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${totalSeconds}s`;
}

// Normalize timestamps: API returns ISO strings, computations need numbers/YYYY-MM-DD
function toTimestamp(val) {
  if (typeof val === "number") return val;
  return new Date(val).getTime();
}

function toDateKey(val) {
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  return new Date(val).toISOString().split("T")[0];
}

export function computeDailyStats(sessions, days) {
  const cutoff = days ? Date.now() - days * 86400000 : 0;
  const filtered = sessions.filter((s) => toTimestamp(s.completedAt) >= cutoff);
  const byDate = {};

  filtered.forEach((s) => {
    const dateKey = toDateKey(s.date || s.completedAt);
    if (!byDate[dateKey]) {
      byDate[dateKey] = { date: dateKey, count: 0, totalSeconds: 0 };
    }
    byDate[dateKey].count++;
    byDate[dateKey].totalSeconds += s.durationSeconds;
  });

  // Determine range: fixed period or earliest session to today
  let numDays = days;
  if (!numDays) {
    if (filtered.length > 0) {
      const earliest = Math.min(...filtered.map((s) => toTimestamp(s.completedAt)));
      numDays = Math.ceil((Date.now() - earliest) / 86400000) + 1;
      numDays = Math.max(numDays, 7); // at least 7 days
    } else {
      numDays = 30;
    }
  }

  // Fill missing days
  const result = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push(byDate[key] || { date: key, count: 0, totalSeconds: 0 });
  }
  return result;
}

export function computeWeeklyStats(sessions, weeks = 12) {
  const cutoff = Date.now() - weeks * 7 * 86400000;
  const filtered = sessions.filter((s) => toTimestamp(s.completedAt) >= cutoff);
  const byWeek = {};

  filtered.forEach((s) => {
    const d = new Date(s.completedAt);
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - d.getDay());
    const key = startOfWeek.toISOString().split("T")[0];
    if (!byWeek[key]) {
      byWeek[key] = { week: key, count: 0, totalSeconds: 0 };
    }
    byWeek[key].count++;
    byWeek[key].totalSeconds += s.durationSeconds;
  });

  return Object.values(byWeek).sort((a, b) => a.week.localeCompare(b.week));
}

export function computeTaskTimeDistribution(sessions, todos) {
  const byTask = {};

  sessions.forEach((s) => {
    if (!s.taskId) return;
    if (!byTask[s.taskId]) {
      const todo = todos.find((t) => t.id === s.taskId);
      byTask[s.taskId] = {
        taskId: s.taskId,
        name: todo ? todo.text : "Deleted Task",
        totalSeconds: 0,
        sessionCount: 0,
      };
    }
    byTask[s.taskId].totalSeconds += s.durationSeconds;
    byTask[s.taskId].sessionCount++;
  });

  return Object.values(byTask).sort(
    (a, b) => b.totalSeconds - a.totalSeconds
  );
}

export function computeCompletionRate(todos) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, active, rate };
}

export function computeAverageSessionLength(sessions) {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  return Math.round(total / sessions.length);
}
