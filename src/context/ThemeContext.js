"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  isDark: true,
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("sonnenland_theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
        applyTheme(storedTheme);
      } else {
        // Default to Dark mode initially as required
        setTheme("dark");
        applyTheme("dark");
        localStorage.setItem("sonnenland_theme", "dark");
      }
    } catch (e) {
      applyTheme("dark");
    }
    setMounted(true);
  }, []);

  const applyTheme = (t) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    try {
      localStorage.setItem("sonnenland_theme", nextTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage:", e);
    }
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
