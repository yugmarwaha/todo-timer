import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getTotalCompletions,
} from "../services/streakService";
import { api } from "../services/api";
import { setOnStreakUpdate } from "./SessionContext";

const StreakContext = createContext(null);

export function StreakProvider({ children }) {
  const [streakData, setStreakData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch streak data from API on mount
  useEffect(() => {
    api("/streaks")
      .then((data) => setStreakData(data.streaks))
      .catch((err) => console.error("Failed to load streaks:", err))
      .finally(() => setLoading(false));
  }, []);

  // Receive streak updates from SessionContext (after timer completion)
  const handleStreakUpdate = useCallback((streakEntry) => {
    setStreakData((prev) => ({
      ...prev,
      [streakEntry.date]: streakEntry.count,
    }));
  }, []);

  useEffect(() => {
    setOnStreakUpdate(handleStreakUpdate);
    return () => setOnStreakUpdate(null);
  }, [handleStreakUpdate]);

  // Derived state (pure computations from streakService)
  const currentStreak = calculateCurrentStreak(streakData);
  const longestStreak = calculateLongestStreak(streakData);
  const totalCompletions = getTotalCompletions(streakData);

  const value = {
    streakData,
    currentStreak,
    longestStreak,
    totalCompletions,
    loading,
  };

  return (
    <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
  );
}

export function useStreak() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
}

export default StreakContext;
