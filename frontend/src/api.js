import { createClient } from "@supabase/supabase-js";

// 🔹 Load Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase credentials are missing. Check your .env file!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** ======================
 *  🔹 AUTHENTICATION METHODS (Email Confirmation Required)
 *  ====================== */

// ✅ Sign Up User (Triggers Email Confirmation)
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  return data.user; // User must confirm email before login
};

// ✅ Sign In User (Only works after email is confirmed)
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  return data.user;
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
 *  🔹 PROFILE COMPLETION METHODS
 *  ====================== */

// ✅ Complete Profile (Stores User in `public.users` after email confirmation)
export const completeProfile = async (fullName, companyName, industry, companySize) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated. Please log in.");
  }

  // Step 1: Insert company (if not already created)
  let companyId;
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("name", companyName)
    .single();

  if (companyError) {
    const { data: newCompany, error: newCompanyError } = await supabase
      .from("companies")
      .insert([{ name: companyName, industry, company_size: companySize }])
      .select("id")
      .single();

    if (newCompanyError) throw newCompanyError;
    companyId = newCompany.id;
  } else {
    companyId = company.id;
  }

  // Step 2: Insert user into `public.users`
  const { error: userInsertError } = await supabase
    .from("users")
    .insert([
      {
        auth_id: user.id, // Link to auth.users
        email: user.email,
        full_name: fullName,
        company_id: companyId,
        industry,
        company_size: companySize,
      },
    ]);

  if (userInsertError) {
    console.error("❌ Error inserting user into public.users:", userInsertError.message);
    throw userInsertError;
  }

  return true;
};

// ✅ Get User Profile (From `public.users`)
export const getUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("❌ Error fetching user profile:", error.message);
    return null;
  }

  return data;
};

/** ======================
 *  🔹 DATA FETCHING METHODS
 *  ====================== */

// ✅ Fetch Asset Data
export const fetchAssets = async () => {
  const { data, error } = await supabase.from("assets").select("*");
  if (error) {
    console.error("❌ Error fetching assets:", error.message);
    return [];
  }
  return data;
};

// ✅ Fetch Company Metrics
export const fetchMetrics = async () => {
  try {
    const { data, error } = await supabase.from("metrics").select("*");
    if (error) {
      console.error("❌ Error fetching metrics:", error.message);
      return { totalAssets: 0, activePMPlans: 0, nextPMTask: "N/A", locations: [] };
    }
    return data;
  } catch (error) {
    console.error("❌ Error fetching metrics:", error);
    return { totalAssets: 0, activePMPlans: 0, nextPMTask: "N/A", locations: [] };
  }
};

export default supabase;
