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
  const [justCompleted, setJustCompleted] = useState(false);
  const intervalRef = useRef(null);
  const timerFinishedRef = useRef(false);

  const totalSeconds = initialMinutes * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progressPercentage = (currentSeconds / totalSeconds) * 100;

  // Enhanced color palette with 6 ranges
  const COLORS = {
    emerald: "#10B981",
    cyan: "#06B6D4",
    sky: "#0EA5E9",
    amber: "#F59E0B",
    orange: "#F97316",
    rose: "#F43F5E",
  };

  /**
   * Returns the color for the timer based on remaining time percentage.
   * Uses a 6-color gradient system for visual feedback.
   * @returns {string} Hex color code
   */
  const getTimerColor = () => {
    const color =
      progressPercentage > 83 ? COLORS.emerald :  // 100-83%: emerald
      progressPercentage > 66 ? COLORS.cyan :     // 83-66%: cyan
      progressPercentage > 50 ? COLORS.sky :      // 66-50%: sky
      progressPercentage > 33 ? COLORS.amber :    // 50-33%: amber
      progressPercentage > 16 ? COLORS.orange :   // 33-16%: orange
      COLORS.rose;                                // 16-0%: rose

    return color;
  };

  /**
   * Returns a CSS gradient based on remaining time percentage.
   * @returns {string} CSS linear-gradient string
   */
  const getTimerGradient = () => {
    if (progressPercentage > 83) {
      return `linear-gradient(135deg, ${COLORS.emerald} 0%, #059669 100%)`;
    } else if (progressPercentage > 66) {
      return `linear-gradient(135deg, ${COLORS.cyan} 0%, #0891B2 100%)`;
    } else if (progressPercentage > 50) {
      return `linear-gradient(135deg, ${COLORS.sky} 0%, #0284C7 100%)`;
    } else if (progressPercentage > 33) {
      return `linear-gradient(135deg, ${COLORS.amber} 0%, #D97706 100%)`;
    } else if (progressPercentage > 16) {
      return `linear-gradient(135deg, ${COLORS.orange} 0%, #EA580C 100%)`;
    } else {
      return `linear-gradient(135deg, ${COLORS.rose} 0%, #E11D48 100%)`;
    }
  };

  // Enhanced preset system
  const PRESETS = [
    { time: 1, label: "Quick", icon: "⚡", color: "#10B981", gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)" },
    { time: 15, label: "Short", icon: "☕", color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" },
    { time: 25, label: "Focus", icon: "🎯", color: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)" },
    { time: 45, label: "Deep", icon: "🔥", color: "#F97316", gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" },
  ];

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
    setJustCompleted(false);
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
    if (!isNaN(numValue) && numValue >= 1) {
      // Cap at 60 minutes
      const clampedValue = Math.min(numValue, 60);
      setInitialMinutes(clampedValue);
      setMinutes(clampedValue);
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
      className="compact-timer timer-card-glass"
      style={{
        border: "none",
        borderRadius: "20px",
        animation: justCompleted
          ? "celebrate 0.6s ease-in-out"
          : isRunning
          ? "pulse 2s infinite"
          : "none",
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
            animation: isRunning ? "ring-pulse 3s ease-in-out infinite" : "none",
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
            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={getTimerColor()} />
                <stop
                  offset="100%"
                  stopColor={getTimerColor()}
                  stopOpacity="0.7"
                />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background track circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(0, 0, 0, 0.08)"
              strokeWidth={strokeWidth}
            />

            {/* Glow layer (beneath progress ring) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getTimerColor()}
              strokeWidth={strokeWidth + 2}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              opacity="0.3"
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                filter: "blur(8px)",
              }}
            />

            {/* Main progress ring with gradient */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                filter: `drop-shadow(0 0 12px ${getTimerColor()}60)`,
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
            {isEditingTime ? (
              <input
                type="text"
                value={editTimeValue}
                onChange={handleTimeEdit}
                onBlur={handleTimeEditBlur}
                onKeyDown={handleTimeEditKeyDown}
                autoFocus
                placeholder="Min"
                style={{
                  fontSize: "4rem",
                  fontWeight: "900",
                  fontFamily: "'Inter', sans-serif",
                  color: getTimerColor(),
                  background: "transparent",
                  border: "none",
                  outline: `3px solid ${getTimerColor()}`,
                  borderRadius: "12px",
                  textAlign: "center",
                  width: "180px",
                  padding: "8px 16px",
                  letterSpacing: "1px",
                  lineHeight: 1,
                }}
              />
            ) : (
              <div
                onClick={handleTimeClick}
                style={{
                  fontSize: "4rem",
                  fontWeight: "900",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "1px",
                  lineHeight: 1,
                  color: getTimerColor(),
                  cursor: !isRunning && !isPaused ? "pointer" : "default",
                  animation: isRunning ? "breathe 4s ease-in-out infinite" : "none",
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
            )}
            <div
              className="mt-2"
              style={{
                color: getTimerColor(),
                fontSize: "0.8rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isRunning && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: getTimerColor(),
                    display: "inline-block",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
              )}
              {isRunning ? "🎯 FOCUS" : isPaused ? "⏸ PAUSED" : "✓ READY"}
            </div>
            <div
              className="mt-1"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                fontWeight: "600",
                background: "var(--input-bg)",
                padding: "4px 12px",
                borderRadius: "12px",
                display: "inline-block",
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
                    e.target.style.background = getTimerColor();
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--input-bg)";
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
                    e.target.style.background = getTimerColor();
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--input-bg)";
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
                background: getTimerGradient(),
                border: "none",
                borderRadius: "12px",
                color: "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 12px ${getTimerColor()}40`,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 6px 20px ${getTimerColor()}60`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 12px ${getTimerColor()}40`;
              }}
              onMouseDown={(e) => {
                e.target.style.animation = "button-press 0.2s ease";
              }}
              onMouseUp={(e) => {
                e.target.style.animation = "none";
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
                    background: `linear-gradient(135deg, ${COLORS.amber} 0%, #D97706 100%)`,
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: `0 2px 8px ${COLORS.amber}40`,
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
                    background: getTimerGradient(),
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: `0 2px 8px ${getTimerColor()}40`,
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
              {PRESETS.map(({ time, label, icon, gradient, color }) => (
                <button
                  key={time}
                  onClick={() => {
                    setInitialMinutes(time);
                    setMinutes(time);
                    setSeconds(0);
                  }}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    borderRadius: "12px",
                    flex: 1,
                    background: gradient,
                    border: "none",
                    color: "#FFFFFF",
                    padding: "10px 8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    boxShadow: `0 2px 8px ${color}30`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px) scale(1.05)";
                    e.target.style.boxShadow = `0 4px 12px ${color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = `0 2px 8px ${color}30`;
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800" }}>{time}m</span>
                  <span style={{ fontSize: "0.65rem", opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
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
