/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "card-light": "#ffffff",
        "card-dark": "#1a2734",
        "text-light-primary": "#101922",
        "text-dark-primary": "#f6f7f8",
        "text-light-secondary": "#6b778c",
        "text-dark-secondary": "#a9b8c7",
        "border-light": "#e7edf3",
        "border-dark": "#2c3a47",
        "surface-light": "#ffffff",
        "surface-dark": "#1b2837",
        "text-primary-light": "#0d141b",
        "text-primary-dark": "#e7edf3",
        "text-secondary-light": "#4c739a",
        "text-secondary-dark": "#a1b8d2",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
}