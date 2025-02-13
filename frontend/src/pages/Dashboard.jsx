import React, { useEffect, useState } from "react";
import { fetchAssets } from "../api";

function Dashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await fetchAssets();
        console.log("📦 API Response in Dashboard:", data);

        // Ensure data is an array before using .map()
        if (Array.isArray(data)) {
          setAssets(data);
        } else {
          console.error("⚠️ Unexpected API response:", data);
          setAssets([]); // Prevent crash
        }
      } catch (error) {
        console.error("❌ Error fetching assets:", error);
      }
    };

    getAssets();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {assets.length === 0 ? (
        <p>⚠️ No assets found</p>
      ) : (
        <ul>
          {assets.map((asset) => (
            <li key={asset.id}>
              {asset.name} ({asset.category}) - {asset.usage_hours} hrs
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;

