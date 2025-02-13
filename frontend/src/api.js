
import axios from "axios";

const API_URL = "https://8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev:8000";

export const fetchAssets = async () => {
  try {
    console.log("Calling API:", `${API_URL}/assets`);
    const response = await axios.get(`${API_URL}/assets`, {
      headers: { Accept: "application/json" },
    });
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};
