import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// 🔹 Supabase Credentials
const SUPABASE_URL = "https://your-project-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔹 Backend API URL
const API_URL = `${window.location.protocol}//${window.location.hostname}:9000`;

/** ======================
 *  🔹 AUTHENTICATION METHODS
 *  ====================== */

// Sign Up User
export const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
};

// Sign In User
export const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return user;
};

// Sign Out User
export const signOut = async () => {
  await supabase.auth.signOut();
};

// Get Current User
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/** ======================
 *  🔹 DATA FETCHING METHODS
 *  ====================== */

// Fetch Asset Data
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

// Fetch Company Metrics (Example Implementation)
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
