/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fcf8f0",
        secondary: "#6b5b4d",
        text: "#131010",
        background: "#b6a593",
      },
    },
  },
  plugins: [],
}