import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<h1>Welcome to AF-PM Planner</h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h1>⚠️ 404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
