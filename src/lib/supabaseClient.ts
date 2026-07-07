import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Returns a shared Supabase client, or null if the env vars aren't set. */
export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  cachedClient = createClient(url, anonKey);
  return cachedClient;
}

/**
 * Races a Supabase call against a timeout so a slow or stalled connection
 * can't leave the UI stuck in a loading state forever. Resolves to
 * `fallback` if `ms` elapses first. `fallback` is intentionally typed as
 * `unknown` rather than `T`: Supabase's response shapes (e.g. PostgrestError)
 * carry extra required fields callers have no reason to fabricate, and we
 * only ever read `data`/`error` off the result.
 */
export function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  fallback: unknown,
): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback as T), ms)),
  ]);
}
