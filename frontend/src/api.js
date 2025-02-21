import axios from "axios";

const API_URL = `${window.location.protocol}//${window.location.hostname}:9000`;

export const fetchAssets = async () => {
  try {
    console.log("📡 Fetching assets...");
    const response = await axios.get(`${API_URL}/assets`);
    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};

// ✅ Temporary Mock Data for Dashboard Metrics (Replace with Supabase later)
export const fetchMetrics = async () => {
  return {
    totalAssets: 12,  // Mock total assets
    activePMPlans: 5,  // Mock active PM plans
    nextPMTask: "2024-04-10", // Mock next PM date
    locations: ["Plant A", "Plant B"], // Mock locations
  };
};
