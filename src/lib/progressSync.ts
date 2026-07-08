import { getSupabaseClient, isSupabaseConfigured, withTimeout } from "./supabaseClient";
import type { DayRecord, UserId } from "./types";

const NETWORK_TIMEOUT_MS = 8000;
const TABLE = "user_progress";

export interface RemoteProgressFields {
  history: Record<number, DayRecord>;
  unlockedAchievements: Record<string, string>;
}

interface UserProgressRow {
  user_id: string;
  history: Record<number, DayRecord> | null;
  unlocked_achievements: Record<string, string> | null;
  updated_at: string;
}

// Defensive: a row could exist with null jsonb columns (e.g. hand-inserted
// via the Supabase Table Editor while testing). Never hand callers a value
// that isn't the shape deriveStats()/history readers expect.
function rowToFields(row: UserProgressRow): RemoteProgressFields {
  return {
    history: row.history ?? {},
    unlockedAchievements: row.unlocked_achievements ?? {},
  };
}

/** Reads every user's synced progress from Supabase, keyed by user id.
 * Returns null when Supabase isn't configured or the request fails —
 * callers should keep whatever they already have (e.g. localStorage). */
export async function fetchAllRemoteProgress(): Promise<Record<
  string,
  RemoteProgressFields
> | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseClient()!;
  const { data, error } = await withTimeout(
    supabase.from(TABLE).select("*"),
    NETWORK_TIMEOUT_MS,
    { data: null, error: new Error("Timed out reaching Supabase") },
  );
  if (error || !data) return null;
  const result: Record<string, RemoteProgressFields> = {};
  for (const row of data as UserProgressRow[]) {
    if (row?.user_id) result[row.user_id] = rowToFields(row);
  }
  return result;
}

/** Upserts one user's full progress snapshot to Supabase.
 * No-ops when Supabase isn't configured — the caller's localStorage write
 * is the only persistence in that case. */
export async function upsertRemoteProgress(
  userId: UserId,
  history: Record<number, DayRecord>,
  unlockedAchievements: Record<string, string>,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient()!;
  const { error } = await withTimeout(
    supabase.from(TABLE).upsert(
      {
        user_id: userId,
        history,
        unlocked_achievements: unlockedAchievements,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    ),
    NETWORK_TIMEOUT_MS,
    { error: new Error("Timed out reaching Supabase") },
  );
  if (error) {
    console.error("Failed to sync progress to Supabase:", error.message);
  }
}

/**
 * Subscribes to live task-completion updates from any user so the Team
 * page reflects everyone's latest XP/streak/completion without a manual
 * refresh. Returns an unsubscribe function. No-ops when Supabase isn't
 * configured, since localStorage has no cross-device events to listen for.
 */
export function subscribeToAllProgress(onChange: () => void): () => void {
  if (!isSupabaseConfigured()) return () => {};
  const supabase = getSupabaseClient()!;
  const channel = supabase
    .channel(`user_progress_changes_${Math.random().toString(36).slice(2)}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      () => onChange(),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
