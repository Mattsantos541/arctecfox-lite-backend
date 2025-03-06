import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
if (!supabaseUrl || !supabaseKey) {
 console.error("❌ Supabase credentials are missing. Check your .env file!");
}
/*  🔹 AUTHENTICATION METHODS
*  ====================== */
// ✅ Sign Up User (Triggers Email Confirmation)
export const signUp = async (email, password) => {
 try {
   const { data, error } = await supabase.auth.signUp({ email, password });
   if (error) throw error;
   console.log("✅ User signup successful:", data);
   return data.user; // Return the signed-up user
 } catch (error) {
   console.error("❌ Signup error:", error.message);
   throw error;
 }
};
// ✅ Sign In User (Only works after email confirmation)
export const signIn = async (email, password) => {
 try {
   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
   if (error) throw error;
   return data.user;
 } catch (error) {
   console.error("❌ Sign-in error:", error.message);
   throw error;
 }
};
// ✅ Sign Out User
export const signOut = async () => {
 try {
   const { error } = await supabase.auth.signOut();
   if (error) throw error;
 } catch (error) {
   console.error("❌ Sign-out error:", error.message);
   throw error;
 }
};
// ✅ Get Current User
export const getCurrentUser = async () => {
 try {
   const { data, error } = await supabase.auth.getUser();
   if (error) {
     console.error("❌ Get user error:", error.message);
     return null;
   }
   return data.user || null;
 } catch (error) {
   console.error("❌ Error getting current user:", error.message);
   return null;
 }
};
/*  🔹 PROFILE COMPLETION METHODS
*  ====================== */
// ✅ Check if User Profile is Complete in `public.users`
export const isProfileComplete = async (userId) => {
 const { data, error } = await supabase
   .from("users")
   .select("id")
   .eq("id", userId)
   .single();
 return !!data && !error; // Returns true if user profile exists
};
// ✅ Complete Profile (Insert into `public.users`)
export const completeProfile = async (fullName, companyName, industry, companySize) => {
 try {
   const { data: user, error: userError } = await supabase.auth.getUser();
   if (userError) throw userError;
   if (!user || !user.user) throw new Error("No authenticated user found");
   // Step 1: Insert User Profile into `public.users`
   const { error: profileError } = await supabase
     .from("users")
     .upsert([
       {
         id: user.user.id, // Match auth.users UUID
         full_name: fullName,
         company_name: companyName,
         industry,
         company_size: companySize,
         email: user.user.email,
       },
     ]);
   if (profileError) {
     console.error("❌ Error inserting profile:", profileError.message);
     throw profileError;
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
 try {
   const user = await getCurrentUser();
   if (!user) return null;
   const { data, error } = await supabase
     .from("users")
     .select("*")
     .eq("id", user.id)
     .single();
   if (error) {
     console.error("❌ Get profile error:", error.message);
     return null;
   }
   return data;
 } catch (error) {
   console.error("❌ Error fetching profile:", error.message);
   return null;
 }
};
/*  🔹 DASHBOARD METHODS
*  ====================== */
// ✅ Get Dashboard Metrics
export const getDashboardMetrics = async () => {
 try {
   // Mock data (Replace with real API endpoint)
   return {
     totalAssets: 42,
     activeAssets: 36,
     activePMPlans: 12,
     nextPMTask: "Replace filters on AC units",
     locations: [
       { name: "Building A", assetCount: 15 },
       { name: "Building B", assetCount: 12 },
       { name: "Warehouse", assetCount: 8 },
       { name: "Office", assetCount: 7 },
     ],
   };
 } catch (error) {
   console.error("❌ Error fetching metrics:", error);
   return {
     totalAssets: 0,
     activeAssets: 0,
     activePMPlans: 0,
     nextPMTask: "N/A",
     locations: [],
   };
 }
};
// ✅ Auth state change listener
export const onAuthStateChange = (callback) => {
 return supabase.auth.onAuthStateChange((event, session) => {
   if (event === "SIGNED_IN") {
     callback(session?.user || null);
   } else if (event === "SIGNED_OUT") {
     callback(null);
   }
 });
};
export default supabase;