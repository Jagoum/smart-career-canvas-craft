// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fydjsqfupqygidhxujyt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZGpzcWZ1cHF5Z2lkaHh1anl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODc1NDgsImV4cCI6MjA2MzU2MzU0OH0.JhTOelYqr3wg1f4GJnpT4RwpHILrFoO4WNJCfK4JGRs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);