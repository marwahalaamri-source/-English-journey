import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;
let loggedInvalidConfig = false;

// Trims whitespace/newlines and strips accidentally-pasted surrounding
// quotes — both are common when copy-pasting env var values into a
// dashboard, and would otherwise silently produce an unusable value.
function sanitizeEnvValue(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  const unquoted = trimmed.replace(/^["']|["']$/g, "");
  return unquoted.trim();
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function readConfig(): { url: string; anonKey: string } | null {
  const url = sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey || !isValidHttpUrl(url)) {
    if ((url || anonKey) && !loggedInvalidConfig) {
      loggedInvalidConfig = true;
      console.error(
        "Supabase env vars are set but invalid — falling back to local-only " +
          "mode. Check NEXT_PUBLIC_SUPABASE_URL for stray whitespace/quotes " +
          "and that it's a full https:// URL.",
      );
    }
    return null;
  }
  return { url, anonKey };
}

/** True only when both env vars are present AND the URL is actually
 * parseable — never just a truthiness check, since a malformed value would
 * otherwise crash createClient() instead of falling back gracefully. */
export function isSupabaseConfigured(): boolean {
  return readConfig() !== null;
}

/** Returns a shared Supabase client, or null if the env vars aren't set
 * or aren't valid. Never throws. */
export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const config = readConfig();
  if (!config) return null;
  try {
    cachedClient = createClient(config.url, config.anonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
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
