import axios from "axios";

// Get the current hostname and use port 8000 for the backend
const API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

export const fetchAssets = async () => {
  try {
    console.log("📡 Calling API:", `${API_URL}/assets`);
    const response = await axios.get(`${API_URL}/assets`);

    console.log("✅ API Response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};