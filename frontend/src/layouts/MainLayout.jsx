import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Settings as SettingsIcon, FileText, List, LayoutDashboard, User } from "lucide-react";
import afLogo from "../assets/af-logo.jpg"; // Make sure this file exists inside src/assets

const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-[#0A192F] text-white flex flex-col fixed top-0 left-0 shadow-lg z-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
        <img 
          src={afLogo} 
          alt="ArcTecFox PM" 
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <NavItem to="/pm-planner" icon={<BarChart3 />} label="PM Planner" />
        <NavItem to="/work-orders" icon={<List />} label="Work Orders" />
        <NavItem to="/reports" icon={<FileText />} label="Reports" />
        <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
      </nav>
    </aside>
  );
};

// Sidebar Navigation Item
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition ${
        isActive ? "bg-blue-500 text-white font-semibold" : "hover:bg-gray-700"
      }`
    }
  >
    <span className="w-5 h-5">{icon}</span>
    {label}
  </NavLink>
);

// Top Navigation Bar
const TopBar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 border-b z-50">
      {/* Page Title */}
      <div className="text-gray-700 font-semibold text-lg">ArcTecFox PM</div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Welcome, User</span>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
          <User className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

// Main Layout Structure
const MainLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
