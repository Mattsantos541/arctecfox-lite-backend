import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Settings as SettingsIcon, 
  FileText, 
  List, 
  LayoutDashboard, 
  User, 
  LogOut 
} from "lucide-react";
import afLogo from "../assets/af-logo.jpg"; // Ensure this file is in src/assets



const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-[#0A192F] text-white flex flex-col fixed top-0 left-0 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <img 
          src={afLogo} 
          alt="ArcTecFox PM" 
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <NavItem to="/pm-planner" icon={<BarChart3 />} label="PM Planner" />
        <NavItem to="/work-orders" icon={<List />} label="Work Orders" />
        <NavItem to="/reports" icon={<FileText />} label="Reports" />
        <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
      </nav>
    </aside>
  );
};

// Sidebar Nav Item Component
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
        isActive 
          ? "bg-[#007BFF] text-white font-semibold shadow-md"
          : "hover:bg-[#0056b3] hover:text-white text-gray-300"
      }`
    }
  >
    <span className="w-6 h-6">{icon}</span>
    <span className="text-lg">{label}</span>
  </NavLink>
);

// Top Navigation Bar
const TopBar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 border-b z-10">
      {/* Centered Title */}
      <div className="text-gray-800 font-bold text-xl flex-1 text-center">
        ArcTecFox PM
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-6">
        <span className="text-gray-700 font-medium">Welcome, User</span>
        <button 
          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-sm text-gray-700 hover:bg-gray-200 hover:text-[#007BFF] transition duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

// Main Layout Structure
const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
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
