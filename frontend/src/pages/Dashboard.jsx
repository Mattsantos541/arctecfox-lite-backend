import React, { useEffect, useState } from "react";
import { fetchAssets } from "../api";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching assets:", error);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading assets...</p>
      ) : assets.length > 0 ? (
        <ul>
          {assets.map(asset => (
            <li key={asset.id}>{asset.name} - {asset.category} ({asset.usage_hours} hours)</li>
          ))}
        </ul>
      ) : (
        <p>No assets found.</p>
      )}
    </div>
  );
}

export default Dashboard;
