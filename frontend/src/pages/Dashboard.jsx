
import React, { useEffect, useState } from "react";
import { fetchAssets } from "../api";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    activePMPlans: 0,
    costSavings: 0,
    nextPMDue: null
  });

  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await fetchAssets();
        setAssets(Array.isArray(data) ? data : []);
        // TODO: Fetch metrics from API
        setMetrics({
          totalAssets: data.length,
          activePMPlans: 5,
          costSavings: 12500,
          nextPMDue: "2024-03-15"
        });
      } catch (error) {
        console.error("❌ Error fetching assets:", error);
        setAssets([]);
      }
    };

    getAssets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Total Assets" value={metrics.totalAssets} />
        <MetricCard title="Active PM Plans" value={metrics.activePMPlans} />
        <MetricCard title="Cost Savings" value={`$${metrics.costSavings}`} />
        <MetricCard title="Next PM Due" value={metrics.nextPMDue} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Assets Overview</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Usage Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.usage_hours} hrs</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.environment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default Dashboard;
