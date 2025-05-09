/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#9333EA",
        background: "#F3F4F6",
        text: "#111827",
      },
    },
  },
  plugins: [],
};
