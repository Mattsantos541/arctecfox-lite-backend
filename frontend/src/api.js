import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// 🔹 Load Environment Variables Safely
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase credentials are missing. Check your .env file!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔹 Backend API URL (For fetching assets & metrics)
const API_URL = `${window.location.protocol}//${window.location.hostname}:9000`;

/** ======================
 *  🔹 AUTHENTICATION METHODS
 *  ====================== */

// ✅ Sign Up User & Insert into public.users
export const signUp = async (email, password, fullName, industry, companySize) => {
  try {
    // Step 1: Create user in auth.users (handled by Supabase)
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw new Error(`Sign-up Error: ${error.message}`);
    const user = data.user;

    // Step 2: Insert user details into public.users
    if (user) {
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            auth_id: user.id, // Link to auth.users
            email,
            full_name: fullName,
            industry,
            company_size: companySize,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("❌ Error inserting user into public.users:", insertError.message);
        throw new Error(`Database Insert Error: ${insertError.message}`);
      }
    }

    return user;
  } catch (err) {
    console.error("❌ Sign-up Failed:", err.message);
    throw err;
  }
};

// ✅ Sign In User
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Sign-in Error: ${error.message}`);
    return data.user;
  } catch (err) {
    console.error("❌ Sign-in Failed:", err.message);
    throw err;
  }
};

// ✅ Sign Out User
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Sign-out Error: ${error.message}`);
  } catch (err) {
    console.error("❌ Sign-out Failed:", err.message);
    throw err;
  }
};

// ✅ Get Current User
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data?.user || null;
  } catch (err) {
    console.error("❌ Error fetching current user:", err.message);
    return null;
  }
};

// ✅ Get User Profile (From public.users)
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .single();

    if (error) throw new Error(`User Profile Fetch Error: ${error.message}`);
    return data;
  } catch (err) {
    console.error("❌ Error fetching user profile:", err.message);
    return null;
  }
};

/** ======================
 *  🔹 DATA FETCHING METHODS
 *  ====================== */

// ✅ Fetch Asset Data
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

// ✅ Fetch Company Metrics
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
