/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        secondary: "#e5e7eb",
        destructive: "#ef4444",
        muted: "#f3f4f6",
        accent: "#22c55e",
        border: "#d1d5db",
        input: "#f9fafb",
        background: "#ffffff",
        foreground: "#1f2937",
        card: "#f9fafb",
      },
    },
  },
  plugins: [],
}
