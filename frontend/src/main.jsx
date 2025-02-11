import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("🚀 Main.jsx is running!"); // Debug log

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
