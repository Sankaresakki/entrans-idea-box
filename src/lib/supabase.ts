import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when both env vars are present and non-placeholder.
 * When false, all db.ts functions are no-ops and the app falls
 * back to localStorage (same behaviour as before Supabase was added).
 */
export const isSupabaseConfigured: boolean = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your-project-url-here" &&
  supabaseAnonKey !== "your-anon-key-here"
);

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (null as unknown as SupabaseClient);
