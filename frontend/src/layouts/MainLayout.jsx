import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { BarChart3, Settings as SettingsIcon, FileText, List, LayoutDashboard } from "lucide-react";

// Import all pages
import Dashboard from "../pages/Dashboard";
import PMPlanner from "../pages/PMPlanner";
import WorkOrders from "../pages/WorkOrders";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

// Sidebar Component
const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed">
      <div className="text-2xl font-bold p-5 border-b border-gray-700">AF-PM Planner</div>
      <nav className="flex-1 px-4 py-2">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/pm-planner"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <BarChart3 className="w-5 h-5" />
          PM Planner
        </NavLink>
        <NavLink
          to="/work-orders"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <List className="w-5 h-5" />
          Work Orders
        </NavLink>
        <NavLink
          to="/reports"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <FileText className="w-5 h-5" />
          Reports
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <SettingsIcon className="w-5 h-5" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

// Main Layout Component
const MainLayout = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 ml-64">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pm-planner" element={<PMPlanner />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default MainLayout;
