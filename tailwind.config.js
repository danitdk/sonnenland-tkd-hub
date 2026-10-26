/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F8FAFC",
          deep: "#F8FAFC",
          rich: "#F1F5F9",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E2E8F0",
          elevated: "#F8FAFC",
          dark: "#F1F5F9",
        },
        crimson: {
          DEFAULT: "#DC2626",
          light: "#EF4444",
          dark: "#B91C1C",
          glow: "rgba(220, 38, 38, 0.2)",
        },
        gold: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
          dark: "#B45309",
          glow: "rgba(217, 119, 6, 0.15)",
        },
      },
      boxShadow: {
        'glow-crimson': '0 4px 14px 0 rgba(220, 38, 38, 0.25)',
        'glow-gold': '0 4px 14px 0 rgba(217, 119, 6, 0.2)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
