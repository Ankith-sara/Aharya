/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a120b",
        secondary: "#3c2a21",
        text: "#d5cea3",
        background: "#e5e5cb",
      },
    },
  },
  plugins: [],
}