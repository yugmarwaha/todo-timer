import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

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
      className="dark-mode-toggle"
      data-active={darkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="toggle-knob">
        {darkMode ? <FiSun size={12} /> : <FiMoon size={12} />}
      </span>
    </button>
  );
}

export default DarkModeToggle;
