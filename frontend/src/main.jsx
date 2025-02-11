import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("🚀 Main.jsx is running!"); // Debug log

const root = ReactDOM.createRoot(document.getElementById("root"));

// Added to attempt to enable dev tools, but this is incomplete and likely won't work as intended.  
// The original problem of non-functional dev tools requires a different approach.
if (process.env.NODE_ENV === 'development') {
  //This will likely throw an error because it's trying to import from a non-existent path.  This needs to be fixed.
  try {
    const { worker } = await import('./mocks/browser');
    worker.start();
  } catch (error) {
    console.error("Failed to enable mocks:", error);
  }

}


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Additional log to check if Root Element is found
if (!document.getElementById("root")) {
  console.error("Root element not found! Check your index.html.");
}