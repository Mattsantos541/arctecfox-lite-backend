import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { BarChart3, Settings as SettingsIcon, FileText, List, LayoutDashboard } from "lucide-react";

import Dashboard from "../pages/Dashboard";
import PMPlanner from "../pages/PMPlanner";
import WorkOrders from "../pages/WorkOrders";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

const Sidebar = () => (
  <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed">
    <div className="text-2xl font-bold p-5 border-b border-gray-700">AF-PM Planner</div>
    <nav className="flex-1 px-4 py-2">
      <NavLink to="/dashboard" className="nav-link"><LayoutDashboard className="w-5 h-5" /> Dashboard</NavLink>
      <NavLink to="/pm-planner" className="nav-link"><BarChart3 className="w-5 h-5" /> PM Planner</NavLink>
      <NavLink to="/work-orders" className="nav-link"><List className="w-5 h-5" /> Work Orders</NavLink>
      <NavLink to="/reports" className="nav-link"><FileText className="w-5 h-5" /> Reports</NavLink>
      <NavLink to="/settings" className="nav-link"><SettingsIcon className="w-5 h-5" /> Settings</NavLink>
    </nav>
  </aside>
);

const MainLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-6 ml-64">{children}</main>
  </div>
);

export default MainLayout;
