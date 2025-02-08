import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // FastAPI backend URL

export const fetchAssets = async () => {
  try {
    const response = await axios.get(`${API_URL}/assets`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
};
