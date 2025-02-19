import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Settings, 
  FileText, 
  List, 
  LayoutDashboard,
  MessageCircle,
  Wrench,  
  Map,
  Package,
  Users,
  User,
  LogOut
} from "lucide-react";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2236] text-white flex flex-col">
        {/* ✅ Logo Section */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-700">
          <img src="/af-logo.jpg" alt="ArcTecFox PM" className="h-14 w-auto" />
        </div>

        {/* ✅ Navigation */}
        <nav className="py-4 space-y-2">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/work-orders" icon={<List size={20} />} label="Work Orders" />
          <NavItem to="/requests" icon={<MessageCircle size={20} />} label="Requests" />
          <NavItem to="/pm-planner" icon={<BarChart3 size={20} />} label="PM Planner" />
          <NavItem to="/assets" icon={<Wrench size={20} />} label="Assets" />
          <NavItem to="/locations" icon={<Map size={20} />} label="Locations" />
          <NavItem to="/inventory" icon={<Package size={20} />} label="Parts Inventory" />
          <NavItem to="/teams" icon={<Users size={20} />} label="Teams/People" />
          <NavItem to="/reports" icon={<FileText size={20} />} label="Reports" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ Top Header with Account Management */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Monthly Reports</h1>

          {/* ✅ Account Section */}
          <div className="flex items-center space-x-6">
            <User className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-medium">Welcome, User</span>
            <button className="flex items-center gap-2 bg-red-500 px-3 py-2 rounded-md text-white hover:bg-red-700 transition duration-300">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ✅ Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ✅ Sidebar Navigation Item Component
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-6 py-3 text-sm rounded-lg ${
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
