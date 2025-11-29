import { useState, useEffect, useRef } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";

function Timer({
  compact = false,
  showHero = false,
  initialTime = 25,
  onTimerComplete = null
}) {
  const [initialMinutes, setInitialMinutes] = useState(initialTime);
  const [minutes, setMinutes] = useState(initialTime);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editTimeValue, setEditTimeValue] = useState("");
  const intervalRef = useRef(null);
  const timerFinishedRef = useRef(false);

  const totalSeconds = initialMinutes * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progressPercentage = (currentSeconds / totalSeconds) * 100;

  // Custom color palette
  const COLORS = {
    blue: "#8CE4FF",
    yellow: "#FEEE91",
    orange: "#FFA239",
    red: "#FF5656",
  };

  // Get color based on time remaining
  const getTimerColor = () => {
    const color =
      progressPercentage > 75 ? COLORS.blue :
      progressPercentage > 50 ? COLORS.yellow :
      progressPercentage > 25 ? COLORS.orange :
      COLORS.red;

    return color;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                // Timer finished - clear interval immediately
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }

                setIsRunning(false);
                setIsPaused(false);

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

                // Call optional completion callback
                if (onTimerComplete) {
                  onTimerComplete();
                }

                // Reset to initial time
                setTimeout(() => setSeconds(0), 0);
                return initialMinutes;
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
  }, [isRunning, onTimerComplete, initialMinutes]);

  const handleStart = () => {
    // If starting from X:00, adjust to (X-1):59 to prevent immediate decrement
    if (seconds === 0 && minutes > 0) {
      setMinutes((prev) => prev - 1);
      setSeconds(59);
    }
    setIsRunning(true);
    setIsPaused(false);
    timerFinishedRef.current = false; // Reset the flag when starting
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  const adjustTime = (amount) => {
    if (!isRunning && !isPaused) {
      const newMinutes = Math.max(1, Math.min(60, initialMinutes + amount));
      setInitialMinutes(newMinutes);
      setMinutes(newMinutes);
      setSeconds(0);
    }
  };

  // Custom time input handlers
  const handleTimeClick = () => {
    if (!isRunning && !isPaused) {
      setIsEditingTime(true);
      setEditTimeValue(String(initialMinutes));
    }
  };

  const handleTimeEdit = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setEditTimeValue(value);
    }
  };

  const handleTimeEditBlur = () => {
    applyEditedTime();
  };

  const handleTimeEditKeyDown = (e) => {
    if (e.key === "Enter") {
      applyEditedTime();
    } else if (e.key === "Escape") {
      setIsEditingTime(false);
      setEditTimeValue("");
    }
  };

  const applyEditedTime = () => {
    const numValue = parseInt(editTimeValue, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 999) {
      setInitialMinutes(numValue);
      setMinutes(numValue);
      setSeconds(0);
    }
    setIsEditingTime(false);
    setEditTimeValue("");
  };

  // SVG circle properties
  const size = 280;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <Card
      className="compact-timer"
      style={{
        border: "none",
        background: "var(--card-bg)",
        borderRadius: "20px",
        boxShadow: "var(--card-shadow)",
        animation: isRunning ? "pulse 2s infinite" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Card.Body className="p-4 d-flex flex-column align-items-center">
        {/* Header */}
        <div
          className="text-center mb-4"
          style={{
            width: "100%",
            padding: "8px 16px",
            background:
              "linear-gradient(135deg, #06B6D4 0%, #14B8A6 50%, #10B981 100%)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: "700",
              color: "var(--text-secondary)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Focus Timer
          </div>
        </div>

        {/* Circular Timer */}
        <div
          className="mb-4"
          style={{
            position: "relative",
            width: size,
            height: size,
            margin: "0 auto",
          }}
        >
          <svg
            width={size}
            height={size}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: "rotate(-90deg)",
            }}
          >
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#f5f5f5"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getTimerColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                filter: `drop-shadow(0 0 8px ${getTimerColor()}50)`,
              }}
            />
          </svg>

          {/* Timer display in center */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                fontWeight: "900",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "1px",
                lineHeight: 1,
                color: getTimerColor(),
              }}
            >
              {String(minutes).padStart(2, "0")}
              <span
                style={{ opacity: 0.3, margin: "0 3px", fontWeight: "400" }}
              >
                :
              </span>
              {String(seconds).padStart(2, "0")}
            </div>
            <div
              className="mt-2"
              style={{
                color: getTimerColor(),
                fontSize: "0.8rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                transition: "all 0.3s ease",
              }}
            >
              {isRunning ? "FOCUS" : isPaused ? "PAUSED" : "READY"}
            </div>
            <div
              className="mt-1"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                fontWeight: "600",
              }}
            >
              {Math.round(progressPercentage)}% remaining
            </div>
          </div>
        </div>

        {/* Time adjustment controls */}
        {!isRunning && !isPaused && (
          <div className="mb-3 w-100">
            <div className="d-flex align-items-center justify-content-center gap-3">
              <button
                onClick={() => adjustTime(-5)}
                disabled={initialMinutes <= 1}
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  fontSize: "1.6rem",
                  fontWeight: "300",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  cursor: initialMinutes <= 1 ? "not-allowed" : "pointer",
                  opacity: initialMinutes <= 1 ? 0.4 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (initialMinutes > 1)
                    e.target.style.background = COLORS.blue;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f5f5f5";
                }}
              >
                −
              </button>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "var(--text-primary)",
                  minWidth: "90px",
                  textAlign: "center",
                  padding: "10px 20px",
                  borderRadius: "14px",
                  background: "var(--input-bg)",
                }}
              >
                {initialMinutes}
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginLeft: "4px",
                  }}
                >
                  min
                </span>
              </div>
              <button
                onClick={() => adjustTime(5)}
                disabled={initialMinutes >= 60}
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  fontSize: "1.6rem",
                  fontWeight: "300",
                  border: "none",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  cursor: initialMinutes >= 60 ? "not-allowed" : "pointer",
                  opacity: initialMinutes >= 60 ? 0.4 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (initialMinutes < 60)
                    e.target.style.background = COLORS.blue;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f5f5f5";
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Control buttons */}
        <div className="w-100 mb-3">
          {!isRunning && !isPaused ? (
            <button
              onClick={handleStart}
              style={{
                width: "100%",
                fontSize: "1rem",
                fontWeight: "700",
                padding: "10px 20px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                background: "#14B8A6",
                border: "none",
                borderRadius: "12px",
                color: "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 12px #14B8A640`,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 6px 20px #14B8A660`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 12px #14B8A640`;
              }}
            >
              ▶ START
            </button>
          ) : (
            <div className="d-flex gap-2">
              {isRunning ? (
                <button
                  onClick={handlePause}
                  style={{
                    flex: "1",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    padding: "10px",
                    background: COLORS.orange,
                    border: "none",
                    borderRadius: "12px",
                    color: "#333",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  ⏸ PAUSE
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  style={{
                    flex: "1",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    padding: "10px",
                    background: COLORS.blue,
                    border: "none",
                    borderRadius: "12px",
                    color: "#333",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  ▶ RESUME
                </button>
              )}
              <button
                onClick={handleReset}
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  padding: "10px 16px",
                  background: "var(--input-bg)",
                  border: "none",
                  borderRadius: "12px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                ↺ RESET
              </button>
            </div>
          )}
        </div>

        {/* Quick presets */}
        {!isRunning && !isPaused && (
          <div className="w-100">
            <div
              className="text-center mb-2"
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Quick Presets
            </div>
            <div className="d-flex gap-2 justify-content-center">
              {[
                { time: 1, color: "#10B981", textColor: "#FFFFFF" },
                { time: 15, color: "#FBBF24", textColor: "#064E3B" },
                { time: 25, color: "#06B6D4", textColor: "#FFFFFF" },
                { time: 45, color: "#F97316", textColor: "#FFFFFF" },
              ].map(({ time, color, textColor }) => (
                <button
                  key={time}
                  onClick={() => {
                    setInitialMinutes(time);
                    setMinutes(time);
                    setSeconds(0);
                  }}
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    borderRadius: "10px",
                    flex: 1,
                    background: color,
                    border: "none",
                    color: textColor,
                    padding: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {time}m
                </button>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default Timer;
