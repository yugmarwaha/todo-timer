/**
 * Streak Service - Pure computation functions
 * Persistence is handled by the API; these functions operate on in-memory data.
 */

export function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateCurrentStreak(data) {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateKey(date);

    if (data[dateKey] && data[dateKey] > 0) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(data) {
  const dates = Object.keys(data).sort();
  if (dates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 0;
  let prevDate = null;

  for (const dateStr of dates) {
    if (data[dateStr] <= 0) continue;

    const currentDate = new Date(dateStr);

    if (prevDate) {
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    prevDate = currentDate;
  }

  return longestStreak;
}

export function getTotalCompletions(data) {
  return Object.values(data).reduce((sum, count) => sum + count, 0);
}

export function generateDateRange(days = 365) {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push({
      date,
      dateKey: formatDateKey(date),
    });
  }

  return dates;
}
