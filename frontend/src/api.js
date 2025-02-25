import axios from "axios";

const API_URL = `${window.location.protocol}//${window.location.hostname}:9000`;

// Fetch Asset Data
export const fetchAssets = async () => {
  try {
    console.log("📡 Fetching assets from:", `${API_URL}/assets`);
    const response = await axios.get(`${API_URL}/assets`);
    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};

// Fetch Company Metrics (Example Implementation)
export const fetchMetrics = async () => {
  try {
    console.log("📡 Fetching company metrics from:", `${API_URL}/metrics`);
    const response = await axios.get(`${API_URL}/metrics`);
    return response.data || {
      totalAssets: 0,
      activePMPlans: 0,
      nextPMTask: "N/A",
      locations: [],
    };
  } catch (error) {
    console.error("❌ Error fetching metrics:", error);
    return {
      totalAssets: 0,
      activePMPlans: 0,
      nextPMTask: "N/A",
      locations: [],
    };
  }
};
