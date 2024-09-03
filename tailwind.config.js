/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "bg-start-color": "var(--bg-start-color)",
        "bg-end-color": "var(--bg-end-color)",
        "foreground": "var(--foreground)",
        "card": "var(--card)",
        "accent": "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",

      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}