import React from "react";

export default function App() {
  return (
    <div className="custom-body min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="custom-nav w-64 h-screen p-6 flex flex-col">
        <img src="/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-4" />
        <ul className="space-y-4">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/pm-planner">PM Planner</a></li>
          <li><a href="/work-orders">Work Orders</a></li>
          <li><a href="/reports">Reports</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
        {/* Logout Button */}
        <button className="custom-button mt-auto">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="custom-h1 text-3xl">Welcome to ArcTecFox PM</h1>
        {/* ✅ Tailwind Test */}
        <div className="bg-blue-500 text-white p-4 text-2xl font-bold mt-6">
          If this is blue, Tailwind is working!
        </div>
      </main>
    </div>
  );
}
