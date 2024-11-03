import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Heuristically determines if the application is in production.
const IS_PRODUCTION = Boolean(SUPABASE_URL);

export const supabase = initializeSupabaseClient();

// Creates a Supabase client instance based on the environment.
function initializeSupabaseClient() {
  if (IS_PRODUCTION && SUPABASE_URL && SUPABASE_ANON_KEY) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
