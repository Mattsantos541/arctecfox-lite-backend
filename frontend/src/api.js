import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase credentials are missing. Check your .env file!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const API_BASE_URL = "http://localhost:8000"; // ✅ Ensure correct API URL

/*  🔹 AUTHENTICATION METHODS
 *  ====================== */

// ✅ Export fetchAssets to be used by other modules
export const fetchAssets = async () => {
  try {
    const { data, error } = await supabase
      .from("assets")
      .select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching assets:", error.message);
    throw error;
  }
};

// ✅ Sign In User (FastAPI Authentication)
export const signIn = async (email, password) => {
  try {
    // Format the data as `x-www-form-urlencoded`
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    // Send request to FastAPI login route
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`❌ Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token); // ✅ Store JWT in localStorage
    console.log("✅ Login successful:", data);
    return data.user; // Return user data

  } catch (error) {
    console.error("❌ Sign-in error:", error.message);
    throw error;
  }
};

// ✅ Get Current User (From FastAPI)
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/api/user-session`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("❌ Session error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.user || null;

  } catch (error) {
    console.error("❌ Error getting current user:", error.message);
    return null;
  }
};

// ✅ Sign Out User
export const signOut = async () => {
  try {
    // Clear local token
    localStorage.removeItem("token");

    // Logout from Supabase (optional)
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log("✅ User signed out.");
  } catch (error) {
    console.error("❌ Sign-out error:", error.message);
    throw error;
  }
};
