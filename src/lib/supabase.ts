
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Hardcoded fallback values for development (these would typically be in env variables)
// In production, you should use the Supabase integration in Lovable
const FALLBACK_SUPABASE_URL = 'https://your-supabase-project-id.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'your-supabase-anon-key';

// For Lovable projects with Supabase integration, these would be injected at build time
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== FALLBACK_SUPABASE_URL && supabaseAnonKey !== FALLBACK_SUPABASE_ANON_KEY;
};

