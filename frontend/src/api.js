import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// 🔹 Supabase Credentials (Replace with your actual keys)
const SUPABASE_URL = "https://your-project-url.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "your-anon-key"; // Replace with your Supabase API Key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔹 Backend API URL (For fetching data)
const API_URL = `${window.location.protocol}//${window.location.hostname}:9000`;

/** ======================
 *  🔹 AUTHENTICATION METHODS (Fixed)
 *  ====================== */

// ✅ Sign Up User (Returns user & session)
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user; // Return the user object
};

// ✅ Sign In User (Returns user & session)
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user; // Return the user object
};

// ✅ Sign Out User
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ✅ Get Current User (Handles null case properly)
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user || null;
};

/** ======================
 *  🔹 DATA FETCHING METHODS
 *  ====================== */

// ✅ Fetch Asset Data (From Backend API)
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

// ✅ Fetch Company Metrics (Example Implementation)
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

export default supabase;
