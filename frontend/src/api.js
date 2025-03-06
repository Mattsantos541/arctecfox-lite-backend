
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/*  🔹 AUTHENTICATION METHODS
 *  ====================== */

// ✅ Sign Up User (Triggers Email Confirmation)
export const signUp = async (email, password) => {
  try {
    // Step 1: Create user in auth.users (handled by Supabase)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    console.log("✅ User signup successful:", data);
    return data.user;
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    throw error;
  }
};

// ✅ Sign In User (Only works after email is confirmed)
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

// ✅ Sign Out User
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ✅ Get Current User
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("❌ Get user error:", error.message);
    return null;
  }
  
  if (!data.user) return null;
  
  return data.user;
};

// ✅ Check if User Profile is Complete
export const isProfileComplete = async (userId) => {
  // Check if user exists in the public.users table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn("User profile check error:", error.message);
    return false;
  }

  // If we got data back, the profile is complete
  return !!data;
};

/*  🔹 PROFILE COMPLETION METHODS
 *  ====================== */

export const completeProfile = async (fullName, companyName, industry, companySize) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("No authenticated user found");

    // Update user metadata in auth.users
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        company_name: companyName,
        industry,
        company_size: companySize
      }
    });

    if (updateError) throw updateError;

    // Also store in your users table if you have one
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        full_name: fullName,
        company_name: companyName,
        industry,
        company_size: companySize,
        email: user.email
      });

    if (profileError) {
      console.warn("Error updating users table, but auth data was updated:", profileError.message);
      // Don't throw here to allow the flow to continue even if this fails
    }

    console.log("✅ Profile completed successfully");
    return true;
  } catch (error) {
    console.error("❌ Error completing profile:", error.message);
    throw error;
  }
};

// ✅ Get User Profile (From `public.users`)
export const getUserProfile = async () => {
  const user = await getCurrentUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error("❌ Get profile error:", error.message);
    return null;
  }
  
  return data;
};

/*  🔹 DASHBOARD METHODS
 *  ====================== */

// ✅ Get Dashboard Metrics
export const getDashboardMetrics = async () => {
  try {
    // This would normally fetch metrics from your backend
    // For now, we'll return mock data
    const data = {
      totalAssets: 42,
      activeAssets: 36,
      activePMPlans: 12,
      nextPMTask: "Replace filters on AC units",
      locations: [
        { name: "Building A", assetCount: 15 },
        { name: "Building B", assetCount: 12 },
        { name: "Warehouse", assetCount: 8 },
        { name: "Office", assetCount: 7 },
      ]
    };
    
    return data;
  } catch (error) {
    console.error("❌ Error fetching metrics:", error);
    return { totalAssets: 0, activeAssets: 0, activePMPlans: 0, nextPMTask: "N/A", locations: [] };
  }
};

// ✅ Auth state change listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      callback(session?.user || null);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
};
