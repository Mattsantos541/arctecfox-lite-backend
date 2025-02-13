
import axios from "axios";

// Get the current hostname from the window location
const API_URL = window.location.protocol + '//' + window.location.hostname + ':8000';

export const fetchAssets = async () => {
  try {
    console.log("Calling API:", `${API_URL}/assets`);
    const response = await axios.get(`${API_URL}/assets`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    if (response.data && Array.isArray(response.data)) {
      console.log("✅ API Response:", response.data);
      return response.data;
    } else {
      console.error("⚠️ API returned unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching assets:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return [];
  }
};
