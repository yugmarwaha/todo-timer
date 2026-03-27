import { useState, useEffect, useMemo } from "react";
import { FiBarChart2, FiClock, FiCheckCircle, FiActivity } from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "../context/SessionContext";
import { useTodo } from "../context/TodoContext";
import {
  computeDailyStats,
  computeWeeklyStats,
  computeTaskTimeDistribution,
  computeCompletionRate,
  computeAverageSessionLength,
  formatDuration,
} from "../services/analyticsService";
import "./AnalyticsPage.css";

const CHART_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];

const PERIODS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "All Time", days: null },
];

function AnalyticsPage() {
  const { sessions } = useSession();
  const { todos } = useTodo();
  const [period, setPeriod] = useState(30);
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

  const filteredSessions = useMemo(() => {
    if (!period) return sessions;
    const cutoff = Date.now() - period * 86400000;
    return sessions.filter((s) => new Date(s.completedAt).getTime() >= cutoff);
  }, [sessions, period]);

  const dailyStats = useMemo(
    () => computeDailyStats(sessions, period),
    [sessions, period]
  );

  const weeklyStats = useMemo(
    () => computeWeeklyStats(sessions),
    [sessions]
  );

  const taskDistribution = useMemo(
    () => computeTaskTimeDistribution(filteredSessions, todos),
    [filteredSessions, todos]
  );

  const completionRate = useMemo(
    () => computeCompletionRate(todos),
    [todos]
  );

  const avgSession = useMemo(
    () => computeAverageSessionLength(filteredSessions),
    [filteredSessions]
  );

  const totalFocusTime = useMemo(
    () => filteredSessions.reduce((sum, s) => sum + s.durationSeconds, 0),
    [filteredSessions]
  );

  const recentSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 15);
  }, [sessions]);

  const axisColor = isDarkMode
    ? "rgba(255,255,255,0.4)"
    : "rgba(0,0,0,0.3)";
  const gridColor = isDarkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.06)";
  const tooltipBg = isDarkMode ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDarkMode ? "#334155" : "#e2e8f0";

  const hasData = sessions.length > 0;

  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Insights into your productivity patterns.</p>
        </div>

        {/* Period Toggle */}
        <div className="analytics-period-toggle">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              className={`analytics-period-btn ${period === p.days ? "active" : ""}`}
              onClick={() => setPeriod(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="analytics-stats-grid">
          <div className="analytics-stat-card">
            <div className="analytics-stat-value">
              {filteredSessions.length}
            </div>
            <div className="analytics-stat-label">Sessions</div>
          </div>
          <div className="analytics-stat-card">
            <div className="analytics-stat-value">
              {formatDuration(totalFocusTime)}
            </div>
            <div className="analytics-stat-label">Focus Time</div>
          </div>
          <div className="analytics-stat-card">
            <div className="analytics-stat-value">
              {completionRate.completed}
            </div>
            <div className="analytics-stat-label">Tasks Done</div>
          </div>
          <div className="analytics-stat-card">
            <div className="analytics-stat-value">
              {formatDuration(avgSession)}
            </div>
            <div className="analytics-stat-label">Avg Session</div>
          </div>
        </div>

        {!hasData ? (
          <div className="analytics-empty">
            <div className="analytics-empty-icon">
              <FiBarChart2 size={24} />
            </div>
            <p style={{ fontWeight: 600 }}>No session data yet.</p>
            <p style={{ fontSize: "0.9rem" }}>
              Complete a timer session to start seeing analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Charts Grid */}
            <div className="analytics-charts-grid">
              {/* Daily Sessions */}
              <div className="analytics-chart-card">
                <div className="analytics-chart-title">
                  <FiActivity
                    size={16}
                    style={{ marginRight: 6, verticalAlign: -2 }}
                  />
                  Daily Sessions
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyStats}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: axisColor }}
                      tickFormatter={(d) => {
                        const date = new Date(d + "T00:00:00");
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                      interval={Math.max(0, Math.floor(dailyStats.length / 7) - 1)}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: axisColor }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                      formatter={(value) => [value, "Sessions"]}
                      labelFormatter={(d) => {
                        const date = new Date(d + "T00:00:00");
                        return date.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Trend */}
              <div className="analytics-chart-card">
                <div className="analytics-chart-title">
                  <FiBarChart2
                    size={16}
                    style={{ marginRight: 6, verticalAlign: -2 }}
                  />
                  Weekly Trend
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyStats}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: axisColor }}
                      tickFormatter={(d) => {
                        const date = new Date(d + "T00:00:00");
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: axisColor }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                      formatter={(value) => [value, "Sessions"]}
                      labelFormatter={(d) => `Week of ${d}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#6366f1" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Second Row */}
            <div className="analytics-charts-grid">
              {/* Time Per Task */}
              <div className="analytics-chart-card">
                <div className="analytics-chart-title">
                  <FiClock
                    size={16}
                    style={{ marginRight: 6, verticalAlign: -2 }}
                  />
                  Time Per Task
                </div>
                {taskDistribution.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={taskDistribution}
                          dataKey="totalSeconds"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={85}
                          innerRadius={48}
                          paddingAngle={2}
                        >
                          {taskDistribution.map((_, i) => (
                            <Cell
                              key={i}
                              fill={CHART_COLORS[i % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                          formatter={(value) => [
                            formatDuration(value),
                            "Time",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
                      {taskDistribution.map((item, i) => (
                        <div key={item.taskId} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                          <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                            {item.name.length > 20 ? item.name.slice(0, 20) + "…" : item.name}
                          </span>
                          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                            {formatDuration(item.totalSeconds)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>

                ) : (
                  <div
                    className="analytics-empty"
                    style={{ padding: "2rem" }}
                  >
                    <p style={{ fontSize: "0.85rem" }}>
                      Link tasks to timer sessions to see distribution.
                    </p>
                  </div>
                )}
              </div>

              {/* Task Completion */}
              <div className="analytics-chart-card">
                <div className="analytics-chart-title">
                  <FiCheckCircle
                    size={16}
                    style={{ marginRight: 6, verticalAlign: -2 }}
                  />
                  Task Completion
                </div>
                {todos.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "2rem",
                      height: 250,
                    }}
                  >
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Completed",
                              value: completionRate.completed,
                            },
                            { name: "Active", value: completionRate.active },
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={55}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill={isDarkMode ? "#334155" : "#e2e8f0"} />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div>
                      <div
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: 800,
                          color: "var(--success)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {completionRate.rate}%
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {completionRate.completed} of{" "}
                        {completionRate.total} tasks
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="analytics-empty"
                    style={{ padding: "2rem" }}
                  >
                    <p style={{ fontSize: "0.85rem" }}>
                      Add tasks to see completion stats.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
              <div className="analytics-chart-card">
                <div className="analytics-chart-title">
                  <FiClock
                    size={16}
                    style={{ marginRight: 6, verticalAlign: -2 }}
                  />
                  Recent Sessions
                </div>
                <ul className="analytics-session-list">
                  {recentSessions.map((session) => {
                    const task = todos.find(
                      (t) => t.id === session.taskId
                    );
                    return (
                      <li
                        key={session.id}
                        className="analytics-session-item"
                      >
                        <span className="analytics-session-task">
                          {task
                            ? task.text
                            : session.taskId
                              ? "Deleted Task"
                              : "No task linked"}
                        </span>
                        <span className="analytics-session-meta">
                          <span>
                            {formatDuration(session.durationSeconds)}
                          </span>
                          <span>
                            {new Date(
                              session.completedAt
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
