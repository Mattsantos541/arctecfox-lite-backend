
import axios from "axios";

// Use window.location.hostname to get the current domain
const BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

export const fetchAssets = async () => {
  try {
    console.log("🔹 Calling API:", `${BASE_URL}/assets`);
    const response = await axios.get(`${BASE_URL}/assets`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    if (response.data) {
      console.log("✅ API Response:", response.data);
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("❌ Error fetching assets:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return [];
  }
};
