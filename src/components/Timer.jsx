import { useState } from "react";
import { FiPlay, FiPause, FiRefreshCw, FiVolumeX } from "react-icons/fi";
import { useTimer } from "../context/TimerContext";

function Timer() {
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
    isSoundPlaying,
    handleStart,
    handlePause,
    handleReset,
    setTime,
    stopSound,
  } = useTimer();

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editHours, setEditHours] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editSeconds, setEditSeconds] = useState("");

  const totalSeconds =
    initialHours * 3600 + initialMinutes * 60 + initialSeconds;
  const currentSeconds = hours * 3600 + minutes * 60 + seconds;
  const progressPercentage = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;

  const PRESETS = [
    { time: 25, label: "Pomodoro" },
    { time: 60, label: "Focus" },
    { time: 90, label: "Deep Work" },
    { time: 120, label: "Flow" },
  ];

  // SVG circle properties
  const size = 280;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  const handleTimeClick = () => {
    if (!isRunning && !isPaused) {
      setIsEditingTime(true);
      setEditHours(String(initialHours));
      setEditMinutes(String(initialMinutes));
      setEditSeconds(String(initialSeconds));
    }
  };

  const handleFieldChange = (setter, max) => (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= max)) {
      setter(value);
    }
  };

  const applyEditedTime = () => {
    const h = parseInt(editHours, 10) || 0;
    const m = parseInt(editMinutes, 10) || 0;
    const s = parseInt(editSeconds, 10) || 0;
    setTime(h, m, s);
    setIsEditingTime(false);
  };

  const handleTimeEditKeyDown = (e) => {
    if (e.key === "Enter") applyEditedTime();
    else if (e.key === "Escape") setIsEditingTime(false);
  };

  return (
    <div
      className="timer-card fade-in"
      style={{
        animation: justCompleted ? "celebrate 0.6s ease-in-out" : undefined,
      }}
    >
      <div className="d-flex flex-column align-items-center">
        {/* Circular Timer */}
        <div
          style={{
            position: "relative",
            width: size,
            height: size,
            margin: "0 auto 1.5rem",
            animation: isRunning ? "pulse-ring 3s ease-in-out infinite" : "none",
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
              filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.15))"
            }}
          >
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth={strokeWidth}
              style={{ opacity: 0.3 }}
            />
            {/* Progress ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s linear",
                filter: "drop-shadow(0 0 4px var(--accent))"
              }}
            />
          </svg>

          {/* Time display */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div className="timer-display-text font-mono">
              {String(hours).padStart(2, "0")}
              <span className="separator">:</span>
              {String(minutes).padStart(2, "0")}
              <span className="separator">:</span>
              {String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Editable time input */}
        {!isRunning && !isPaused && (
          <div className="text-center mb-4" style={{ width: "100%", maxWidth: 320 }}>
            {isEditingTime ? (
              <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={editHours}
                    onChange={handleFieldChange(setEditHours, 23)}
                    onKeyDown={handleTimeEditKeyDown}
                    onBlur={applyEditedTime}
                    autoFocus
                    placeholder="0"
                    aria-label="Hours"
                    className="timer-input-field"
                  />
                  <span style={{ color: "var(--text-muted)", fontWeight: 300, fontSize: "1.25rem" }}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editMinutes}
                    onChange={handleFieldChange(setEditMinutes, 59)}
                    onKeyDown={handleTimeEditKeyDown}
                    placeholder="0"
                    aria-label="Minutes"
                    className="timer-input-field"
                  />
                  <span style={{ color: "var(--text-muted)", fontWeight: 300, fontSize: "1.25rem" }}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={editSeconds}
                    onChange={handleFieldChange(setEditSeconds, 59)}
                    onKeyDown={handleTimeEditKeyDown}
                    placeholder="0"
                    aria-label="Seconds"
                    className="timer-input-field"
                  />
                </div>
                <button className="btn-accent" onClick={applyEditedTime} style={{ padding: "0.5rem 1rem" }}>
                  Set
                </button>
              </div>
            ) : (
              <button
                onClick={handleTimeClick}
                className="btn-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto",
                }}
              >
                {initialHours > 0 && <span>{initialHours}h</span>}
                <span>{initialMinutes}m</span>
                {initialSeconds > 0 && <span>{initialSeconds}s</span>}
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  (Edit)
                </span>
              </button>
            )}
          </div>
        )}

        {/* Control buttons */}
        <div className="w-100 mb-4" style={{ maxWidth: 320 }}>
          {!isRunning && !isPaused ? (
            <div className="d-flex flex-column gap-3">
              {isSoundPlaying && (
                <button
                  className="btn-accent w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={stopSound}
                  style={{ background: "var(--danger)", padding: "0.75rem" }}
                >
                  <FiVolumeX size={18} />
                  Stop Sound
                </button>
              )}
              <button
                className="btn-accent w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleStart}
                style={{ padding: "0.875rem", fontSize: "1.1rem" }}
              >
                <FiPlay size={20} />
                Start Timer
              </button>
            </div>
          ) : (
            <div className="d-flex gap-3">
              {isRunning ? (
                <button
                  className="btn-accent d-flex align-items-center justify-content-center gap-2"
                  onClick={handlePause}
                  style={{ flex: 1 }}
                >
                  <FiPause size={18} />
                  Pause
                </button>
              ) : (
                <button
                  className="btn-accent d-flex align-items-center justify-content-center gap-2"
                  onClick={handleStart}
                  style={{ flex: 1 }}
                >
                  <FiPlay size={18} />
                  Resume
                </button>
              )}
              <button
                className="btn-ghost d-flex align-items-center justify-content-center gap-2"
                onClick={handleReset}
              >
                <FiRefreshCw size={18} />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Quick presets */}
        {!isRunning && !isPaused && (
          <div style={{ width: "100%", maxWidth: 360 }}>
            <div className="section-label text-center mb-3">Quick Presets</div>
            <div className="d-flex gap-2">
              {PRESETS.map(({ time, label }) => (
                <button
                  key={time}
                  onClick={() => setTime(0, time, 0)}
                  className="btn-ghost"
                  style={{
                    flex: 1,
                    padding: "0.75rem 0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {time}m
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
