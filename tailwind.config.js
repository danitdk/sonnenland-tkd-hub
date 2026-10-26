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
          DEFAULT: "#0B0F19",
          deep: "#0B0F19",
          rich: "#111827",
        },
        surface: {
          DEFAULT: "#1F2937",
          card: "#1F2937",
          border: "#374151",
          elevated: "#283548",
          dark: "#111827",
        },
        crimson: {
          DEFAULT: "#DC2626",
          light: "#EF4444",
          dark: "#B91C1C",
          glow: "rgba(220, 38, 38, 0.25)",
        },
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
          glow: "rgba(245, 158, 11, 0.2)",
        },
      },
      boxShadow: {
        'glow-crimson': '0 0 25px -5px rgba(220, 38, 38, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
