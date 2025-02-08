import React, { useEffect, useState } from "react";
import { fetchAssets } from "../api";

function Dashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets().then(setAssets);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Assets List</h2>
      <ul>
        {assets.length > 0 ? (
          assets.map((asset) => (
            <li key={asset.id}>
              {asset.name} - {asset.category} - {asset.usage_hours} hours
            </li>
          ))
        ) : (
          <p>No assets found.</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
