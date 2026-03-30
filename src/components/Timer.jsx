import { useState, useRef, useEffect } from "react";
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
  const editContainerRef = useRef(null);

  // Click outside edit inputs to apply and close
  useEffect(() => {
    if (!isEditingTime) return;
    const handleClickOutside = (e) => {
      if (editContainerRef.current && !editContainerRef.current.contains(e.target)) {
        applyEditedTime();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingTime, editHours, editMinutes, editSeconds]);

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
          className="timer-ring-container"
          style={{
            width: size,
            height: size,
            animation: isRunning ? "pulse-ring 3s ease-in-out infinite" : "none",
          }}
        >
          <svg width={size} height={size} className="timer-ring-svg">
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
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          {/* Time display */}
          <div
            onClick={handleTimeClick}
            className="timer-center-content"
            style={{ cursor: !isRunning && !isPaused ? "pointer" : "default" }}
          >
            <div className="timer-display-text font-mono">
              {String(hours).padStart(2, "0")}
              <span>:</span>
              {String(minutes).padStart(2, "0")}
              <span>:</span>
              {String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Editable time input */}
        {!isRunning && !isPaused && (
          <div className="text-center mb-4" style={{ width: "100%", maxWidth: 320 }}>
            {isEditingTime ? (
              <div ref={editContainerRef} className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={editHours}
                    onChange={handleFieldChange(setEditHours, 23)}
                    onKeyDown={handleTimeEditKeyDown}
                    autoFocus
                    placeholder="0"
                    aria-label="Hours"
                    className="timer-input-field"
                  />
                  <span className="timer-separator">:</span>
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
                  <span className="timer-separator">:</span>
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
                  className="btn-ghost preset-btn"
                >
                  <span className="preset-btn__time">{time}m</span>
                  <span className="preset-btn__label">{label}</span>
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
