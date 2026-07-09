// Server-only Supabase access for the cross-device sync feature.
// Never import this from a client component — it uses the service role
// key, which must never reach the browser bundle.
import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Returns null when Supabase env vars aren't set — sync is opt-in. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}
