import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
