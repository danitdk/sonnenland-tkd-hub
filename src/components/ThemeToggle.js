"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({
  showLabel = true,
  className = "",
  size = "md",
}) {
  const { theme, toggleTheme, isDark, mounted } = useTheme();

  // Prevent hydration mismatch before mount
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 opacity-50 ${className}`}
        style={{ minWidth: showLabel ? "88px" : "40px", minHeight: "40px" }}
      >
        <Moon className="h-4 w-4 text-amber-400" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`group relative inline-flex items-center gap-2 rounded-xl border transition-all active:scale-95 select-none ${
        isDark
          ? "border-slate-700/80 bg-slate-800/90 text-slate-100 hover:border-amber-400/60 hover:bg-slate-700/90 shadow-sm"
          : "border-slate-300 bg-white text-slate-800 hover:border-amber-500/80 hover:bg-slate-50 shadow-sm"
      } ${
        size === "sm"
          ? "px-2.5 py-1.5 text-xs min-h-[36px]"
          : "px-3 py-2 text-xs sm:text-sm min-h-[44px]"
      } ${className}`}
    >
      {/* Icon */}
      <span className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </span>

      {/* Label showing English mode name */}
      {showLabel && (
        <span className="flex items-center gap-1.5 font-bold tracking-tight text-xs">
          {isDark ? (
            <span className="text-amber-400 font-bold">
              Light
            </span>
          ) : (
            <span className="text-slate-800 font-bold">
              Dark
            </span>
          )}
        </span>
      )}
    </button>
  );
}
