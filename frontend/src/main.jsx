import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("🚀 Main.jsx is running!"); // Debug log

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found! Check index.html.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
