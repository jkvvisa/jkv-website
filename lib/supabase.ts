import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function createSupabaseClient(): SupabaseClient | null {
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !supabaseUrl.startsWith("http")
  ) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdminClient(): SupabaseClient | null {
  if (
    !supabaseUrl ||
    !supabaseServiceKey ||
    !supabaseUrl.startsWith("http")
  ) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export const supabase = createSupabaseClient();
export const supabaseAdmin = createSupabaseAdminClient();
