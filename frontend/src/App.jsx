import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pm-planner" element={<PMPlanner />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
