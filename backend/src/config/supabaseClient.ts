import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Error: Supabase URL not found in environment variables (SUPABASE_URL).');
  // Consider throwing an error in production to halt startup if critical
  throw new Error('Supabase URL not found in environment variables (SUPABASE_URL). Application cannot start.');
}

if (!supabaseServiceRoleKey) {
  console.error('Error: Supabase Service Role Key not found in environment variables (SUPABASE_SERVICE_ROLE_KEY).');
  // Consider throwing an error in production to halt startup if critical
  throw new Error('Supabase Service Role Key not found in environment variables (SUPABASE_SERVICE_ROLE_KEY). Application cannot start.');
}

// Create and export the Supabase client
// The service role key allows bypassing Row Level Security (RLS)
// and should be used ONLY in secure backend environments.
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // It's generally recommended to disable auto-refreshing tokens for server-side clients
    // if you are primarily using service_role key or handling auth explicitly per request.
    autoRefreshToken: false,
    persistSession: false,
    // detectSessionInUrl: false // Only relevant for client-side auth with PKCE
  }
});

// Optional: Add a simple log to confirm client initialization (can be removed in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase client initialized for backend use.');
}
// To verify, you might want to add a simple query here during setup,
// e.g., supabase.from('your_table_name').select('*').limit(1)
// but ensure it doesn't fail if the table doesn't exist yet.
// For now, just initializing is the goal.
