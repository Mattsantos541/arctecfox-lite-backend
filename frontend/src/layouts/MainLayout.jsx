import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Settings as SettingsIcon,
  FileText,
  List,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";

// Import all pages
import Dashboard from "../pages/Dashboard";
import PMPlanner from "../pages/PMPlanner";
import WorkOrders from "../pages/WorkOrders";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

// Dummy authentication for testing (replace with real auth logic)
const user = { name: "John Doe", email: "johndoe@example.com" };

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement real logout logic (Clear tokens, redirect to login, etc.)
    alert("Logging out...");
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-[#0A192F] text-white flex flex-col fixed shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-gray-700">
        <img src="/logo.png" alt="AF Logo" className="w-10 h-10" />
        <span className="text-2xl font-bold">AF-PM Planner</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <NavItem to="/dashboard" icon={LayoutDashboard} text="Dashboard" />
        <NavItem to="/pm-planner" icon={BarChart3} text="PM Planner" />
        <NavItem to="/work-orders" icon={List} text="Work Orders" />
        <NavItem to="/reports" icon={FileText} text="Reports" />
        <NavItem to="/settings" icon={SettingsIcon} text="Settings" />
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-700 p-4 text-sm flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-400" />
          <span>{user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// Sidebar Navigation Item Component
const NavItem = ({ to, icon: Icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition ${
        isActive ? "bg-blue-500 text-white" : "hover:bg-gray-700 text-gray-300"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    {text}
  </NavLink>
);

// Main Layout Component
const MainLayout = () => {
  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
  );
};

export default MainLayout;
