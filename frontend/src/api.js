
import axios from "axios";

// Using the correct backend URL with port 8000
const API_URL = "https://8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev:8000";

export const fetchAssets = async () => {
  try {
    console.log("Calling API:", `${API_URL}/assets`);
    const response = await axios.get(`${API_URL}/assets`);
    if (response.data && Array.isArray(response.data)) {
      console.log("✅ API Response:", response.data);
      return response.data;
    } else {
      console.error("⚠️ API returned unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};
