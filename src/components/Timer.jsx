import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useTimer } from "../context/TimerContext";

function Timer({ compact = false, showHero = false, onTimerComplete = null }) {
  const {
    initialHours,
    initialMinutes,
    initialSeconds,
    hours,
    minutes,
    seconds,
    isRunning,
    isPaused,
    justCompleted,
    handleStart,
    handlePause,
    handleReset,
    setTime,
  } = useTimer();

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editHours, setEditHours] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editSeconds, setEditSeconds] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const totalSeconds =
    initialHours * 3600 + initialMinutes * 60 + initialSeconds;
  const currentSeconds = hours * 3600 + minutes * 60 + seconds;
  const progressPercentage = (currentSeconds / totalSeconds) * 100;

  // Muted color palette for minimal design
  const COLORS = {
    neutral: "#64748B", // neutral gray (default)
    amber: "#F59E0B", // amber for <10 min
    red: "#EF4444", // red for <3 min
  };

  /**
   * Returns the color for the timer ring.
   * Uses consistent color for all timers.
   * @returns {string} Hex color code
   */
  const getTimerColor = () => {
    // Use lighter color in dark mode for visibility
    return isDarkMode ? "#CBD5E1" : "#64748B"; // Consistent neutral gray for all timers
  };

  const getButtonBackground = () => {
    return isDarkMode ? "#64748B" : "#60A5FA"; // Muted gray in dark mode, blue in light mode
  };

  const getButtonHoverBackground = () => {
    return isDarkMode ? "#475569" : "#3B82F6"; // Darker gray in dark mode, darker blue in light mode
  };

  const getButtonShadow = () => {
    return isDarkMode
      ? "0 2px 8px rgba(100, 116, 139, 0.3)"
      : "0 2px 8px rgba(96, 165, 250, 0.3)";
  };

  const getButtonHoverShadow = () => {
    return isDarkMode
      ? "0 4px 12px rgba(71, 85, 105, 0.4)"
      : "0 4px 12px rgba(59, 130, 246, 0.4)";
  };

  const getPresetBackground = () => {
    return isDarkMode ? "#64748B" : "#F1F5F9";
  };

  const getPresetBorder = () => {
    return isDarkMode ? "none" : "1px solid #E2E8F0";
  };

  const getPresetColor = () => {
    return isDarkMode ? "#FFFFFF" : "#475569";
  };

  const getPresetHoverBackground = () => {
    return isDarkMode ? "#475569" : "#E2E8F0";
  };

  const getPresetShadow = () => {
    return isDarkMode
      ? "0 2px 8px rgba(100, 116, 139, 0.3)"
      : "0 2px 4px rgba(0, 0, 0, 0.05)";
  };

  const getPresetHoverShadow = () => {
    return isDarkMode
      ? "0 4px 12px rgba(71, 85, 105, 0.4)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)";
  };

  const getBackgroundTrackColor = () => {
    return isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  };

  const getTimerDisplayColor = () => {
    return isDarkMode ? "#f0f6fc" : "#1E293B";
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
    {
      time: 1,
      label: "Quick",
      icon: "⚡",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      time: 5,
      label: "Break",
      icon: "☕",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
    {
      time: 25,
      label: "Focus",
      icon: "🎯",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    },
    {
      time: 45,
      label: "Deep",
      icon: "🔥",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
  ];

  // Watch for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };

    // Check initial theme
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Custom time input handlers
  const handleTimeClick = () => {
    if (!isRunning && !isPaused) {
      setIsEditingTime(true);
      setEditHours(String(initialHours));
      setEditMinutes(String(initialMinutes));
      setEditSeconds(String(initialSeconds));
    }
  };

  const handleHoursEdit = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 23)) {
      setEditHours(value);
    }
  };

  const handleMinutesEdit = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 59)) {
      setEditMinutes(value);
    }
  };

  const handleSecondsEdit = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 59)) {
      setEditSeconds(value);
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
      setEditHours("");
      setEditMinutes("");
      setEditSeconds("");
    }
  };

  const applyEditedTime = () => {
    const h = parseInt(editHours, 10) || 0;
    const m = parseInt(editMinutes, 10) || 0;
    const s = parseInt(editSeconds, 10) || 0;

    setTime(h, m, s);
    setIsEditingTime(false);
    setEditHours("");
    setEditMinutes("");
    setEditSeconds("");
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
        {/* Circular Timer */}
        <div
          className="mb-4"
          style={{
            position: "relative",
            width: size,
            height: size,
            margin: "0 auto",
            animation: isRunning
              ? "ring-pulse 3s ease-in-out infinite"
              : "none",
          }}
        >
          <svg
            width={size}
            height={size}
            className="timer-ring"
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
            </defs>

            {/* Background track circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={getBackgroundTrackColor()}
              strokeWidth={strokeWidth}
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
                fontSize: "3rem",
                fontWeight: "900",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "1px",
                lineHeight: 1,
                color: getTimerDisplayColor(),
                animation: isRunning
                  ? "breathe 4s ease-in-out infinite"
                  : "none",
              }}
            >
              {String(hours).padStart(2, "0")}
              <span
                style={{ opacity: 0.3, margin: "0 3px", fontWeight: "400" }}
              >
                :
              </span>
              {String(minutes).padStart(2, "0")}
              <span
                style={{ opacity: 0.3, margin: "0 3px", fontWeight: "400" }}
              >
                :
              </span>
              {String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Editable timer input */}
        {!isRunning && !isPaused && (
          <div className="text-center mb-3">
            {isEditingTime ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={editHours}
                    onChange={handleHoursEdit}
                    onKeyDown={handleTimeEditKeyDown}
                    autoFocus
                    placeholder="0"
                    className="timer-input"
                    style={{ width: "60px !important" }}
                  />
                  <span
                    style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}
                  >
                    :
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editMinutes}
                    onChange={handleMinutesEdit}
                    onKeyDown={handleTimeEditKeyDown}
                    placeholder="0"
                    className="timer-input"
                    style={{ width: "60px !important" }}
                  />
                  <span
                    style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}
                  >
                    :
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editSeconds}
                    onChange={handleSecondsEdit}
                    onKeyDown={handleTimeEditKeyDown}
                    placeholder="0"
                    className="timer-input"
                    style={{ width: "60px !important" }}
                  />
                </div>
                <button
                  onClick={applyEditedTime}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    background: "var(--accent-blue)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(96, 165, 250, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  ✓ Set
                </button>
              </div>
            ) : (
              <div
                onClick={handleTimeClick}
                style={{
                  cursor: "pointer",
                  border: "none",
                  padding: "14px 20px",
                  width: "240px",
                  minHeight: "70px",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  borderRadius: "12px",
                  textAlign: "center",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(16, 185, 129, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "var(--input-bg)")
                }
              >
                {initialHours > 0 && (
                  <div>
                    {initialHours} <span className="timer-min-label">hr</span>
                  </div>
                )}
                <div>
                  {initialMinutes} <span className="timer-min-label">min</span>
                </div>
                {initialSeconds > 0 && (
                  <div>
                    {initialSeconds}{" "}
                    <span className="timer-min-label">sec</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Control buttons */}
        <div className="w-100 mb-3">
          {!isRunning && !isPaused ? (
            <button
              onClick={handleStart}
              style={{
                width: "100%",
                fontSize: "18px",
                fontWeight: "700",
                padding: "16px 20px",
                height: "56px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                background: getButtonBackground(),
                border: "none",
                borderRadius: "12px",
                color: "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: getButtonShadow(),
              }}
              onMouseEnter={(e) => {
                e.target.style.background = getButtonHoverBackground();
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = getButtonHoverShadow();
              }}
              onMouseLeave={(e) => {
                e.target.style.background = getButtonBackground();
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = getButtonShadow();
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
                    background: getButtonBackground(),
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: getButtonShadow(),
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = getButtonHoverBackground();
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = getButtonHoverShadow();
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = getButtonBackground();
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = getButtonShadow();
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
                    background: getButtonBackground(),
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: getButtonShadow(),
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = getButtonHoverBackground();
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = getButtonHoverShadow();
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = getButtonBackground();
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = getButtonShadow();
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
                  background: getButtonBackground(),
                  border: "none",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: getButtonShadow(),
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = getButtonHoverBackground();
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = getButtonHoverShadow();
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = getButtonBackground();
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = getButtonShadow();
                }}
              >
                🔄 RESET
              </button>
            </div>
          )}
        </div>

        {/* Quick presets */}
        {!isRunning && !isPaused && (
          <div className="w-100">
            <div
              className="text-center mb-2 timer-presets-label"
              style={{
                fontSize: "0.75rem",
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
                  onClick={() => setTime(0, time, 0)}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    borderRadius: "12px",
                    flex: 1,
                    background: getPresetBackground(),
                    border: getPresetBorder(),
                    color: getPresetColor(),
                    padding: "10px 8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    boxShadow: getPresetShadow(),
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = getPresetHoverBackground();
                    e.target.style.transform = "translateY(-2px) scale(1.05)";
                    e.target.style.boxShadow = getPresetHoverShadow();
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = getPresetBackground();
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = getPresetShadow();
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: "800" }}>
                    {time}m
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      opacity: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {label}
                  </span>
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
