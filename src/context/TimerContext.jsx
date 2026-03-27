import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import timerSound from "../assets/sound/620584__nightcustard__six-oclock-westminster-chimes.mp3";

const TimerContext = createContext(null);

// Callback ref to be set by StreakProvider
let onTimerCompleteCallback = null;

export function setOnTimerComplete(callback) {
  onTimerCompleteCallback = callback;
}

// Helpers for deadline-based timer
function msToHMS(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { h, m, s };
}

function hmsToMs(h, m, s) {
  return (h * 3600 + m * 60 + s) * 1000;
}

export function TimerProvider({ children }) {
  const [initialHours, setInitialHours] = useState(0);
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const deadlineRef = useRef(null);
  const remainingMsRef = useRef(null);
  const justCompletedTimeoutRef = useRef(null);

  // Deadline-based timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = deadlineRef.current - now;

        if (remaining <= 0) {
          // Timer finished
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setHours(0);
          setMinutes(0);
          setSeconds(0);
          setIsRunning(false);
          setIsPaused(false);
          setJustCompleted(true);

          // Reset celebration after 2 seconds (with cleanup ref)
          justCompletedTimeoutRef.current = setTimeout(
            () => setJustCompleted(false),
            2000
          );

          // Play completion sound
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          audioRef.current = new Audio(timerSound);
          setIsSoundPlaying(true);
          audioRef.current.play().catch((error) => {
            console.log("Could not play sound:", error);
            setIsSoundPlaying(false);
          });
          audioRef.current.onended = () => {
            setIsSoundPlaying(false);
          };

          // Trigger streak increment
          if (onTimerCompleteCallback) {
            onTimerCompleteCallback();
          }

          // Reset to initial time
          setHours(initialHours);
          setMinutes(initialMinutes);
          setSeconds(initialSeconds);

          deadlineRef.current = null;
          remainingMsRef.current = null;
          return;
        }

        // Normal tick: derive display from wall clock
        const { h, m, s } = msToHMS(remaining);
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, initialHours, initialMinutes, initialSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (justCompletedTimeoutRef.current) {
        clearTimeout(justCompletedTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  const handleStart = useCallback(() => {
    // Stop sound if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSoundPlaying(false);
    }

    if (isPaused && remainingMsRef.current != null) {
      // Resume: use the snapshot, no time lost
      deadlineRef.current = Date.now() + remainingMsRef.current;
    } else {
      // Fresh start: compute deadline from current h/m/s
      const totalMs = hmsToMs(hours, minutes, seconds);
      if (totalMs <= 0) return;
      deadlineRef.current = Date.now() + totalMs;
      remainingMsRef.current = totalMs;
    }

    setIsRunning(true);
    setIsPaused(false);
    setJustCompleted(false);
  }, [isPaused, hours, minutes, seconds]);

  const handlePause = useCallback(() => {
    // Snapshot remaining time before stopping
    if (deadlineRef.current) {
      remainingMsRef.current = Math.max(0, deadlineRef.current - Date.now());
    }
    setIsRunning(false);
    setIsPaused(true);
    // Stop sound if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSoundPlaying(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setHours(initialHours);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
    deadlineRef.current = null;
    remainingMsRef.current = null;
    // Stop sound if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSoundPlaying(false);
    }
  }, [initialHours, initialMinutes, initialSeconds]);

  const setTime = useCallback(
    (newHours = 0, newMinutes = 0, newSeconds = 0) => {
      let h = parseInt(newHours) || 0;
      let m = parseInt(newMinutes) || 0;
      let s = parseInt(newSeconds) || 0;

      // Normalize seconds
      if (s >= 60) {
        m += Math.floor(s / 60);
        s = s % 60;
      }

      // Normalize minutes
      if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
      }

      // Clamp hours to logical max (e.g., 23 or 99)
      const clampedHours = Math.max(0, Math.min(23, h));
      const clampedMinutes = Math.max(0, Math.min(59, m));
      const clampedSeconds = Math.max(0, Math.min(59, s));

      // Ensure at least 1 second is set if everything is 0
      if (clampedHours === 0 && clampedMinutes === 0 && clampedSeconds === 0) {
        setInitialMinutes(1);
        setMinutes(1);
        setInitialSeconds(0);
        setSeconds(0);
        setInitialHours(0);
        setHours(0);
      } else {
        setInitialHours(clampedHours);
        setHours(clampedHours);
        setInitialMinutes(clampedMinutes);
        setMinutes(clampedMinutes);
        setInitialSeconds(clampedSeconds);
        setSeconds(clampedSeconds);
      }
    },
    []
  );

  const adjustTime = useCallback(
    (amount) => {
      if (!isRunning && !isPaused) {
        setInitialMinutes((prev) => {
          const newMinutes = Math.max(1, Math.min(60, prev + amount));
          setMinutes(newMinutes);
          setSeconds(0);
          return newMinutes;
        });
      }
    },
    [isRunning, isPaused]
  );

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSoundPlaying(false);
    }
  }, []);

  const value = {
    // State
    initialHours,
    initialMinutes,
    initialSeconds,
    hours,
    minutes,
    seconds,
    isRunning,
    isPaused,
    justCompleted,
    isSoundPlaying,
    // Actions
    handleStart,
    handlePause,
    handleReset,
    setTime,
    adjustTime,
    stopSound,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}

export default TimerContext;
