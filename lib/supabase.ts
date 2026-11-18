import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** True when the Supabase backend has been configured via environment variables. */
export const isSupabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Server-only Supabase client using the service-role key. Never import this
 * from a client component — the key bypasses row-level security.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const storageBucket = () => process.env.SUPABASE_STORAGE_BUCKET || "publications";
