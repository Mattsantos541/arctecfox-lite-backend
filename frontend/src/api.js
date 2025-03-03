import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials are missing. Check your .env file!");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ✅ Get Current User
 * @returns {Promise<Object|null>} - Current user or null
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data?.user || null;
  } catch (error) {
    console.error("❌ Error getting current user:", error.message);
    return null;
  }
};

/**
 * ✅ Sign Up User
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @param {string} industry - User's industry
 * @param {string} companySize - User's company size
 * @param {string} companyName - User's company name
 * @returns {Promise<Object>} - Supabase user object
 */
export const signUp = async (email, password, fullName, industry, companySize, companyName) => {
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          industry,
          company_size: companySize,
          company_name: companyName
        }
      }
    });

    if (error) throw error;
    const user = data.user;

    // Insert user data into the "users" table
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
            company_name: companyName,
          },
        ]);

      if (insertError) {
        console.error("❌ Error inserting user into users table:", insertError.message);
        throw insertError;
      }
    }

    return user;
  } catch (error) {
    console.error("❌ Error during sign-up:", error.message);
    throw error;
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
      .from("assets")
      .select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching assets:", error.message);
    return [];
  }
};

/**
 * ✅ Fetch Metrics
 * @returns {Promise<Object>} - Metrics data
 */
export const fetchMetrics = async () => {
  try {
    const { data, error } = await supabase
      .from("metrics")
      .select("*");

    if (error) throw error;
    return data || {
      totalAssets: 0,
      activePMPlans: 0,
      nextPMTask: "N/A",
      locations: []
    };
  } catch (error) {
    console.error("❌ Error fetching metrics:", error.message);
    return {
      totalAssets: 0,
      activePMPlans: 0,
      nextPMTask: "N/A",
      locations: []
    };
  }
};

/**
 * ✅ Create Work Order
 * @param {Object} workOrderData - Work order data
 * @returns {Promise<Object>} - Created work order
 */
export const createWorkOrder = async (workOrderData) => {
  try {
    const { data, error } = await supabase
      .from("work_orders")
      .insert([workOrderData])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error creating work order:", error.message);
    throw error;
  }
};

export default supabase;