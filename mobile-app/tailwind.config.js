/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./employer-jut/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(140 10% 85%)',
        input: 'hsl(0 0% 98%)',
        'input-border': 'hsl(140 10% 80%)',
        ring: 'hsl(140 80% 40%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(140 50% 10%)',
        primary: {
          DEFAULT: 'hsl(140 80% 40%)',
          foreground: 'hsl(0 0% 100%)',
          light: 'hsl(140 80% 50%)',
          dark: 'hsl(140 80% 30%)',
        },
        secondary: {
          DEFAULT: 'hsl(140 10% 90%)',
          foreground: 'hsl(140 50% 10%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 85% 60%)',
          foreground: 'hsl(0 0% 100%)',
        },
        muted: {
          DEFAULT: 'hsl(140 5% 95%)',
          foreground: 'hsl(140 20% 40%)',
        },
        accent: {
          DEFAULT: 'hsl(140 70% 50%)',
          foreground: 'hsl(0 0% 100%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 98%)',
          foreground: 'hsl(140 50% 10%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 98%)',
          foreground: 'hsl(140 50% 10%)',
        },
        "muted-foreground": "#6b7280",
        "primary-foreground": "#ffffff",
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  plugins: [],
};
