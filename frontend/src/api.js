import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// 🔹 Load Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase credentials are missing. Check your .env file!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** ======================
 *  🔹 AUTHENTICATION METHODS
 *  ====================== */

// ✅ Sign Up User & Ensure Company Exists
export const signUp = async (email, password, fullName, companyName, industry, companySize) => {
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

  if (insertError) {
    console.error("❌ Error inserting user into public.users:", insertError.message);
    throw insertError;
  }

  return user;
};

// ✅ Get User Data from public.users
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("❌ Error fetching user profile:", error.message);
    return null;
  }

  return data;
};

// ✅ Sign In User
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

// ✅ Get Current User
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user || null;
};

export default supabase;
