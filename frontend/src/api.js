
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase client (Replace with your actual project URL and anon key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yourprojectid.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/*  🔹 AUTHENTICATION METHODS
*  ====================== */

// Sign up a new user
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error("❌ Sign up error:", error.message);
    throw error;
  }
};

// Sign in existing user
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error("❌ Sign in error:", error.message);
    throw error;
  }
};

// Sign out current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("❌ Sign out error:", error.message);
    throw error;
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return user;
  } catch (error) {
    console.error("❌ Error fetching current user:", error.message);
    return null;
  }
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

/*  🔹 PROFILE COMPLETION METHODS
*  ====================== */

// Check if user profile is complete
export const isProfileComplete = async (userId) => {
  try {
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    // Check if essential profile fields are filled
    return !!(data && data.company_name && data.phone_number);
  } catch (error) {
    console.error("❌ Profile check error:", error.message);
    return false;
  }
};

// Complete user profile
export const completeProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date()
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("❌ Profile update error:", error.message);
    throw error;
  }
};

/*  🔹 DATA FETCHING METHODS
*  ====================== */

// Fetch company metrics
export const fetchMetrics = async () => {
  try {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("❌ Error fetching metrics:", error);
    return null;
  }
};

// Fetch company assets
export const fetchAssets = async () => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};
