import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useGame } from "../context/GameContext";

export const ThemeToggle = () => {
  const { user, updateUserProfile } = useGame();
  const [darkMode, setDarkMode] = useState(false);

  // Sync state with HTML root
  useEffect(() => {
    const isDark = user?.darkMode || localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user?.darkMode]);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    if (user) {
      updateUserProfile({ darkMode: nextDark });
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center cursor-pointer"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600" />
      )}
    </button>
  );
};
