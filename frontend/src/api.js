import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ✅ Fetch Assets
export const fetchAssets = async () => {
  try {
    const { data, error } = await supabase.from("assets").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching assets:", error.message);
    throw error;
  }
};

// ✅ User Authentication Functions
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ✅ Get Current User
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user || null;
  } catch (error) {
    console.error("❌ Error getting current user:", error.message);
    return null;
  }
}

// ✅ Fetch Metrics
export const fetchMetrics = async () => {
  try {
    const { data, error } = await supabase.from("metrics").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error fetching metrics:", error.message);
    throw error;
  }
};

// ✅ Complete User Profile (Ensures Profile Data is Inserted)
export async function completeUserProfile(profileData) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: profileData.full_name,
        role: profileData.role,
        company_name: profileData.company_name,
        industry: profileData.industry,
        company_size: profileData.company_size,
        updated_at: new Date().toISOString(),
        profile_completed: true
      })
      .select("*")
      .single();

    if (error) {
      console.error("❌ Profile completion error:", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("❌ Error in completeUserProfile:", error.message);
    throw error;
  }
}

// ✅ Check if User Profile is Complete
export async function isProfileComplete(userId) {
  try {
    if (!userId) throw new Error("User ID is required to check profile status");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  } catch (error) {
    console.error("❌ Error checking profile completion:", error.message);
    throw error;
  }
}
