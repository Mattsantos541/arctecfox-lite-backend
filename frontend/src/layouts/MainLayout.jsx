
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Settings, 
  FileText, 
  List, 
  LayoutDashboard,
  MessageCircle,
  Tool,
  Map,
  Package,
  Users
} from "lucide-react";
import afLogo from "../assets/af-logo.jpg";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2236] text-white">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <img src={afLogo} alt="Logo" className="h-8" />
        </div>

        {/* Navigation */}
        <nav className="py-4">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/work-orders" icon={<List size={20} />} label="Work Orders" />
          <NavItem to="/requests" icon={<MessageCircle size={20} />} label="Requests" />
          <NavItem to="/pm-planner" icon={<BarChart3 size={20} />} label="PM Planner" />
          <NavItem to="/assets" icon={<Tool size={20} />} label="Assets" />
          <NavItem to="/locations" icon={<Map size={20} />} label="Locations" />
          <NavItem to="/inventory" icon={<Package size={20} />} label="Parts Inventory" />
          <NavItem to="/teams" icon={<Users size={20} />} label="Teams/People" />
          <NavItem to="/reports" icon={<FileText size={20} />} label="Reports" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Monthly Reports</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Export Data
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-6 py-3 text-sm ${
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-gray-300 hover:bg-gray-800"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default MainLayout;
