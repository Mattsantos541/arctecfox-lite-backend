// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind scans all your components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Deep blue, good for buttons and highlights
        secondary: "#9333EA", // Purple accent
        background: "#F3F4F6", // Light gray background
        text: "#111827", // Dark text
      },
    },
  },
  plugins: [],
};
