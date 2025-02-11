import axios from "axios";

const API_URL = "http://127.0.0.1:9000"; // Ensure this matches your backend URL

export const fetchAssets = async () => {
  try {
    console.log("Calling API: /assets"); // Debugging log
    const response = await axios.get(`${API_URL}/assets`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};
