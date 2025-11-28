import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./TimerPage.css";

function TimerPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);

  useEffect(() => {
    let interval = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const progress =
    ((totalSeconds - (minutes * 60 + seconds)) / totalSeconds) * 100;

  // Custom color palette
  const COLORS = {
    blue: "#8CE4FF",
    yellow: "#FEEE91",
    orange: "#FFA239",
    red: "#FF5656",
  };

  // Get color based on time remaining
  const currentSeconds = minutes * 60 + seconds;
  const progressPercentage = (currentSeconds / totalSeconds) * 100;

  const getTimerColor = () => {
    const color =
      progressPercentage > 75 ? COLORS.blue :
      progressPercentage > 50 ? COLORS.yellow :
      progressPercentage > 25 ? COLORS.orange :
      COLORS.red;

    return color;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setTotalSeconds(25 * 60);
  };

  const setPreset = (mins) => {
    setIsActive(false);
    setMinutes(mins);
    setSeconds(0);
    setTotalSeconds(mins * 60);
  };

  return (
    <div className="timer-page">
      <Container>
        <div className="timer-hero">
          <h1 className="timer-title">
            <span className="timer-icon">⏰</span>
            Pomodoro Timer
          </h1>
          <p className="timer-subtitle">Stay focused, stay productive</p>
        </div>

        <div className="timer-container">
          <div className="timer-card">
            {/* Circular Progress */}
            <svg className="progress-ring" width="280" height="280">
              <circle
                className="progress-ring-circle-bg"
                cx="140"
                cy="140"
                r="120"
              />
              <circle
                className="progress-ring-circle"
                cx="140"
                cy="140"
                r="120"
                style={{
                  strokeDasharray: `${2 * Math.PI * 120}`,
                  strokeDashoffset: `${
                    2 * Math.PI * 120 * (1 - progress / 100)
                  }`,
                  stroke: getTimerColor(),
                  filter: `drop-shadow(0 0 8px ${getTimerColor()}50)`,
                }}
              />
            </svg>

            {/* Timer Display */}
            <div className="timer-display">
              <div className="time-text" style={{ color: getTimerColor() }}>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>
              <div className="status-text" style={{ color: getTimerColor() }}>
                {isActive ? "FOCUSING" : "READY"}
              </div>
              <div className="percentage-text" style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                {Math.round(progressPercentage)}% remaining
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button className="btn-timer-main" onClick={toggleTimer}>
              {isActive ? "⏸ PAUSE" : "▶ START"}
            </button>
            <button className="btn-timer-secondary" onClick={resetTimer}>
              ↻ RESET
            </button>
          </div>

          {/* Quick Presets */}
          <div className="presets-section">
            <h3 className="presets-title">Quick Sessions</h3>
            <div className="preset-buttons">
              <button
                className="preset-btn preset-short"
                onClick={() => setPreset(1)}
              >
                <span className="preset-time">1</span>
                <span className="preset-label">min</span>
              </button>
              <button
                className="preset-btn preset-medium"
                onClick={() => setPreset(15)}
              >
                <span className="preset-time">15</span>
                <span className="preset-label">min</span>
              </button>
              <button
                className="preset-btn preset-pomodoro"
                onClick={() => setPreset(25)}
              >
                <span className="preset-time">25</span>
                <span className="preset-label">min</span>
              </button>
              <button
                className="preset-btn preset-long"
                onClick={() => setPreset(45)}
              >
                <span className="preset-time">45</span>
                <span className="preset-label">min</span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TimerPage;
