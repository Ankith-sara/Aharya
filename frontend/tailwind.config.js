/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fff0dc",
        secondary: "#543a14",
        text: "#131010",
        background: "#fedbac",
      },
    },
  },
  plugins: [],
}