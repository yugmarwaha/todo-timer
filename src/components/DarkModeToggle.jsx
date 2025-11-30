import { useState, useEffect } from "react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        transition: "transform 0.2s ease",
        fontSize: "24px",
        color: darkMode ? "#CBD5E1" : "#64748B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default DarkModeToggle;
