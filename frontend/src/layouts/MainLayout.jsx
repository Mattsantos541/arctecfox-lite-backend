import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Settings as SettingsIcon, 
  FileText, 
  List, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import afLogo from "../assets/af-logo.jpg"; // Ensure the correct logo path

const Sidebar = () => {
  return (
    <aside className="h-screen w-72 bg-white text-gray-900 flex flex-col fixed top-0 left-0 shadow-lg border-r">
      {/* ✅ Logo Section */}
      <div className="flex items-center justify-center p-6 border-b">
        <img 
          src={afLogo} 
          alt="ArcTecFox PM" 
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* ✅ Navigation Links */}
      <nav className="flex-1 px-6 py-4 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <NavItem to="/pm-planner" icon={<BarChart3 />} label="PM Planner" />
        <NavItem to="/work-orders" icon={<List />} label="Work Orders" />
        <NavItem to="/reports" icon={<FileText />} label="Reports" />
        <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
      </nav>

      {/* ✅ Contact Support Section */}
      <div className="p-6 border-t text-gray-600 text-sm">
        <p>Need Help?</p>
        <a href="mailto:support@arctecfox.com" className="text-blue-500 hover:underline">
          Contact Support
        </a>
      </div>
    </aside>
  );
};

// ✅ Sidebar Navigation Item
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-lg transition duration-300 ${
        isActive 
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "hover:bg-gray-200 hover:text-gray-900 text-gray-600"
      }`
    }
  >
    <span className="w-6 h-6">{icon}</span>
    <span className="text-lg">{label}</span>
  </NavLink>
);

// ✅ Top Navigation Bar with Search and User Info
const TopBar = () => {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white shadow-md flex items-center px-6 border-b z-10">
      {/* 🔍 Search Bar */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-96">
        <Search className="w-5 h-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transpare
