import React, { useEffect, useState } from "react";
import { fetchAssets, fetchMetrics } from "../api"; // Assume API calls are set up
import { AlertTriangle, PlusCircle, FileText, UploadCloud, MapPin, CheckCircle, ClipboardList } from "lucide-react";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    totalLocations: 0,
    activePMPlans: 0,
    upcomingPMTasks: 0,
    maintenanceCompliance: 0,
    costSavings: 0,
  });

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const assetData = await fetchAssets();
        const metricsData = await fetchMetrics();
        setAssets(Array.isArray(assetData) ? assetData : []);
        setMetrics(metricsData);
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
        setAssets([]);
      }
    };

    getDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Company-Wide Preventive Maintenance Overview</h1>

      {/* ✅ Key Metrics Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <MetricCard title="Total Assets" value={metrics.totalAssets} />
        <MetricCard title="Total Locations" value={metrics.totalLocations} />
        <MetricCard title="Active PM Plans" value={metrics.activePMPlans} />
        <MetricCard title="Upcoming PM Tasks" value={metrics.upcomingPMTasks} />
        <MetricCard title="Maintenance Compliance" value={`${metrics.maintenanceCompliance}%`} />
        <MetricCard title="Estimated Cost Savings" value={`$${metrics.costSavings}`} />
      </div>

      {/* ✅ AI Optimization Alerts */}
      <div className="mt-8 bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500 flex items-center">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
        <span className="text-yellow-800 font-medium">⚠️ AI Suggestion: Increase lubrication frequency for Pump B</span>
      </div>

      {/* ✅ Company-Wide Asset Overview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Asset Overview</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Asset Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"># of Assets</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Active PM Plans</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Next PM Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm">{asset.category}</td>
                    <td className="px-6 py-4 text-sm">{asset.count}</td>
                    <td className="px-6 py-4 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {asset.location}
                    </td>
                    <td className="px-6 py-4 text-sm">{asset.pm_plans} Plans</td>
                    <td className="px-6 py-4 text-sm">{asset.next_pm_due || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan="5">
                    No assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Quick Actions Panel */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction icon={<PlusCircle className="w-6 h-6" />} title="Add Asset" />
        <QuickAction icon={<ClipboardList className="w-6 h-6" />} title="Generate AI-Powered PM Plan" />
        <QuickAction icon={<UploadCloud className="w-6 h-6" />} title="Export / Sync with CMMS" />
      </div>
    </div>
  );
};

// ✅ Metric Card Component
const MetricCard = ({ title, value }) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

// ✅ Quick Actions Component
const QuickAction = ({ icon, title }) => (
  <button className="flex items-center p-4 rounded-lg shadow bg-white hover:bg-blue-100 transition">
    {icon}
    <span className="ml-3 font-medium text-gray-700">{title}</span>
  </button>
);

export default Dashboard;
