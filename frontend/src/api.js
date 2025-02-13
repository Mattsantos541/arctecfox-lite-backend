
import axios from "axios";

// Get the current hostname from the window location
const hostname = window.location.hostname;
const API_URL = "https://8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev";


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
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};
