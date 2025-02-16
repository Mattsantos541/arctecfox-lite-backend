import axios from "axios";

// Detect if running in Replit or locally
const API_URL =
  window.location.hostname.includes("replit.dev")
    ? `https://${window.location.hostname}/api`
    : "http://localhost:9000/api";

export const fetchAssets = async () => {
  try {
    console.log("📡 Calling API:", `${API_URL}/assets`);
    const response = await axios.get(`${API_URL}/assets`);
    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};
