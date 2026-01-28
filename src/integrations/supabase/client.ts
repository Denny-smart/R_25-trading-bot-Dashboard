import { createClient } from '@supabase/supabase-js';

// Always use direct Supabase URL for proper WebSocket/Realtime connections
// The Vercel proxy in vercel.json only works for HTTP, not WebSocket
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_ANON_KEY');
  throw new Error('VITE_SUPABASE_ANON_KEY is required');
}

// Use a fallback key to prevent crash, though requests will fail if key is invalid
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
