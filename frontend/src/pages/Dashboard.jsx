import React, { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    console.log("✅ Dashboard component is rendering!");
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>If you see this, React routing is working!</p>
    </div>
  );
}

export default Dashboard;
