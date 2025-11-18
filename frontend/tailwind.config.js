/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      dark: "#0d0d0f",
      indigoAccent: "#4f46e5",
      purpleAccent: "#a78bfa",
    },
  },
}
,
  plugins: [],
}
