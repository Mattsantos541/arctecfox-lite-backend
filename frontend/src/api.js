import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// 🔹 Load Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase credentials are missing. Check your .env file!");
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** ======================
 *  🔹 AUTHENTICATION METHODS
 *  ====================== */

/**
 * ✅ Sign Up User & Ensure Company Exists
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @param {string} companyName - Company name
 * @param {string} industry - Industry of the company
 * @param {string} companySize - Size of the company
 * @returns {Promise<Object>} - Supabase user object
 */
export const signUp = async (email, password, fullName, companyName, industry, companySize) => {
  try {
    // Step 1: Create user in auth.users (handled by Supabase)
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const user = data.user;

    if (!user) throw new Error("User creation failed");

    // Step 2: Check if company already exists
    let { data: existingCompany, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("name", companyName)
      .single();

    if (companyError && companyError.code !== "PGRST116") { // Ignore "No rows found" error
      throw companyError;
    }
    export const signUp = async (email, password, fullName, industry, companySize, companyName) => {
     const { data, error } = await supabase.auth.signUp({ email, password });
     if (error) throw error;
     const user = data.user;
     // Step 2: Insert user data into the "users" table
     if (user) {
       const { error: insertError } = await supabase
         .from("users")
         .insert([
           {
             auth_id: user.id,
             email,
             full_name: fullName,
             industry,
             company_size: companySize,
             company_name: companyName, // Include company name
           },
         ]);
       if (insertError) {
         console.error("❌ Error inserting user into users table:", insertError.message);
         throw insertError;
       }
     }
    

    // Step 3: If company does not exist, create it
    let companyId;
    if (!existingCompany) {
      const { data: newCompany, error: createCompanyError } = await supabase
        .from("companies")
        .insert([{ name: companyName, industry, company_size: companySize }])
        .select("id")
        .single();

      if (createCompanyError) throw createCompanyError;
      companyId = newCompany.id;
    } else {
      companyId = existingCompany.id;
    }

    // Step 4: Insert user into public.users with company details
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id, // Matches Supabase auth.user ID
          email,
          full_name: fullName,
          company_id: companyId, // Foreign Key
          company_name: companyName, // ✅ Store Company Name
          industry,
          company_size: companySize,
        },
      ]);

    if (insertError) throw insertError;

    return user;
  } catch (error) {
    console.error("❌ Error during sign-up:", error.message);
    throw error;
  }
};

/**
 * ✅ Get User Data from public.users
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} - User profile data or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    return null;
  }
};

/**
 * ✅ Sign In User
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Supabase user object
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("❌ Error during sign-in:", error.message);
    throw error;
  }
};

/**
 * ✅ Sign Out User
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("❌ Error during sign-out:", error.message);
    throw error;
  }
};


/**
 * ✅ Fetch Assets
 * @returns {Promise<Array>} - List of assets
 */
export const fetchAssets = async () => {
  try {
    const { data, error } = await supabase
      .from("assets") // Replace with your actual table name
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching assets:", error.message);
    throw error;
  }
};


/**
 * ✅ Fetch Metrics
 * @returns {Promise<Array>} - List of metrics
 */
export const fetchMetrics = async () => {
  try {
    const { data, error } = await supabase
      .from("metrics") // Replace with your actual table name
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching metrics:", error.message);
    throw error;
  }
};

/**
 * ✅ Get Current User
 * @returns {Promise<Object|null>} - Supabase user object or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error("❌ Error fetching current user:", error.message);
    return null;
  }
};

export default supabase;