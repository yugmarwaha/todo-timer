import { useStreak } from "../context/StreakContext";
import { generateDateRange } from "../services/streakService";
import { useMemo, useState, useEffect } from "react";
import { FiTrendingUp, FiAward, FiZap } from "react-icons/fi";

function StreakPage() {
  const { streakData, currentStreak, longestStreak, totalCompletions } =
    useStreak();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const dateRange = useMemo(() => generateDateRange(365), []);

  const getColor = (count) => {
    if (isDarkMode) {
      if (count === 0) return "#1e293b";
      if (count <= 2) return "#312e81";
      if (count <= 5) return "#4338ca";
      return "#6366f1";
    } else {
      if (count === 0) return "#f1f5f9";
      if (count <= 2) return "#c7d2fe";
      if (count <= 5) return "#818cf8";
      return "#6366f1";
    }
  };

  const weeks = useMemo(() => {
    const result = [];
    let currentWeek = [];

    const firstDate = dateRange[0].date;
    const firstDayOfWeek = firstDate.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const { date, dateKey } of dateRange) {
      currentWeek.push({ date, dateKey, count: streakData[dateKey] || 0 });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [dateRange, streakData]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find((day) => day !== null);
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.date.getMonth();
        if (month !== lastMonth) {
          labels.push({
            month: firstDayOfWeek.date.toLocaleString("default", {
              month: "short",
            }),
            weekIndex,
          });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cellSize = 12;
  const cellGap = 3;

  const stats = [
    {
      icon: <FiZap size={20} />,
      value: currentStreak,
      label: "Current Streak",
      color: "var(--warning)",
    },
    {
      icon: <FiAward size={20} />,
      value: longestStreak,
      label: "Longest Streak",
      color: "var(--success)",
    },
    {
      icon: <FiTrendingUp size={20} />,
      value: totalCompletions,
      label: "Total Sessions",
      color: "var(--accent)",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>Focus Streak</h1>
          <p>Track your daily focus sessions and build consistency.</p>
        </div>

        {/* Stats Cards */}
        <div
          className="d-flex justify-content-center gap-3 mb-4 flex-wrap"
          style={{ maxWidth: 640, margin: "0 auto" }}
        >
          {stats.map(({ icon, value, label, color }) => (
            <div
              key={label}
              className="card-modern text-center"
              style={{
                padding: "1.25rem 1.75rem",
                minWidth: 140,
                flex: "1 1 0",
              }}
            >
              <div style={{ color, marginBottom: "0.5rem" }}>{icon}</div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: value > 0 ? "var(--text-primary)" : "var(--text-muted)",
                  lineHeight: 1.2,
                }}
              >
                {value}
              </div>
              <div className="section-label" style={{ marginTop: "0.25rem" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Contribution Calendar */}
        <div
          className="card-modern"
          style={{ padding: "1.5rem 2rem", overflowX: "auto" }}
        >
          <div className="section-label mb-3">
            {totalCompletions} focus session{totalCompletions !== 1 ? "s" : ""} in
            the last year
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {/* Day labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${cellGap}px`,
                marginRight: "8px",
                paddingTop: "20px",
              }}
            >
              {dayLabels.map((day, i) => (
                <div
                  key={day}
                  style={{
                    height: `${cellSize}px`,
                    fontSize: "9px",
                    color: "var(--text-muted)",
                    display: i % 2 === 1 ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "24px",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div>
              {/* Month labels */}
              <div
                style={{
                  display: "flex",
                  marginBottom: "4px",
                  height: "16px",
                  position: "relative",
                }}
              >
                {monthLabels.map(({ month, weekIndex }) => (
                  <div
                    key={`${month}-${weekIndex}`}
                    style={{
                      position: "absolute",
                      left: `${weekIndex * (cellSize + cellGap)}px`,
                      fontSize: "9px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {month}
                  </div>
                ))}
              </div>

              {/* Weeks grid */}
              <div style={{ display: "flex", gap: `${cellGap}px` }}>
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: `${cellGap}px`,
                    }}
                  >
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        title={
                          day
                            ? `${day.count} session${
                                day.count !== 1 ? "s" : ""
                              } on ${day.date.toLocaleDateString()}`
                            : ""
                        }
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          borderRadius: "3px",
                          backgroundColor: day
                            ? getColor(day.count)
                            : "transparent",
                          cursor: day ? "pointer" : "default",
                          transition: "transform 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (day) e.target.style.transform = "scale(1.3)";
                        }}
                        onMouseLeave={(e) => {
                          if (day) e.target.style.transform = "scale(1)";
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "4px",
              marginTop: "1rem",
              fontSize: "10px",
              color: "var(--text-muted)",
            }}
          >
            <span>Less</span>
            {[0, 1, 3, 6].map((count) => (
              <div
                key={count}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  borderRadius: "3px",
                  backgroundColor: getColor(count),
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakPage;
