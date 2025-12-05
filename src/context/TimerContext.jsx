import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const TimerContext = createContext(null);

// Callback ref to be set by StreakProvider
let onTimerCompleteCallback = null;

export function setOnTimerComplete(callback) {
  onTimerCompleteCallback = callback;
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
  const intervalRef = useRef(null);
  const timerFinishedRef = useRef(false);

  // Timer tick logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                setHours((prevHours) => {
                  if (prevHours === 0) {
                    // Timer finished - clear interval immediately
                    if (intervalRef.current) {
                      clearInterval(intervalRef.current);
                    }

                    setIsRunning(false);
                    setIsPaused(false);
                    setJustCompleted(true);

                    // Reset celebration animation after 2 seconds
                    setTimeout(() => setJustCompleted(false), 2000);

                    // Timer finished - add notification
                    if (
                      "Notification" in window &&
                      Notification.permission === "granted"
                    ) {
                      new Notification("Timer Finished!", {
                        body: "Your focus session is complete. Take a break!",
                        icon: "/vite.svg",
                      });
                    } else if (
                      "Notification" in window &&
                      Notification.permission !== "denied"
                    ) {
                      Notification.requestPermission().then((permission) => {
                        if (permission === "granted") {
                          new Notification("Timer Finished!", {
                            body: "Your focus session is complete. Take a break!",
                            icon: "/vite.svg",
                          });
                        }
                      });
                    }
                    // Fallback alert
                    alert("Timer finished! Great job on your focus session.");

                    // Trigger streak increment
                    if (onTimerCompleteCallback) {
                      onTimerCompleteCallback();
                    }

                    // Reset to initial time
                    setTimeout(() => {
                      setSeconds(initialSeconds);
                      setMinutes(initialMinutes);
                      setHours(initialHours);
                    }, 0);
                    return initialHours;
                  }
                  setMinutes(59);
                  return prevHours - 1;
                });
                return 59;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, initialHours, initialMinutes, initialSeconds]);

  const handleStart = useCallback(() => {
    // If starting from X:00:00, adjust to prevent immediate decrement
    if (seconds === 0) {
      if (minutes === 0) {
        if (hours > 0) {
          setHours((prev) => prev - 1);
          setMinutes(59);
          setSeconds(59);
        }
      } else {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      }
    }
    setIsRunning(true);
    setIsPaused(false);
    setJustCompleted(false);
    timerFinishedRef.current = false;
  }, [seconds, minutes, hours]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setHours(initialHours);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  }, [initialHours, initialMinutes, initialSeconds]);

  const setTime = useCallback(
    (newHours = 0, newMinutes = 0, newSeconds = 0) => {
      const clampedHours = Math.max(0, Math.min(23, newHours));
      const clampedMinutes = Math.max(0, Math.min(59, newMinutes));
      const clampedSeconds = Math.max(0, Math.min(59, newSeconds));

      // Ensure at least 1 second is set
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
    // Actions
    handleStart,
    handlePause,
    handleReset,
    setTime,
    adjustTime,
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
