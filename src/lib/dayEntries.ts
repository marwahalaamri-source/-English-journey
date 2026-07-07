import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";
import type { UserId } from "./types";

export interface DayEntryFields {
  vocabWords: string;
  vocabExample: string;
  notes: string;
}

const TABLE = "day_entries";

interface DayEntryRow {
  user_id: UserId;
  day: number;
  vocab_words: string;
  vocab_example: string;
  notes: string;
  updated_at: string;
}

function rowToFields(row: DayEntryRow): DayEntryFields {
  return {
    vocabWords: row.vocab_words,
    vocabExample: row.vocab_example,
    notes: row.notes,
  };
}

/** Reads one user's saved entry for a course day from Supabase.
 * Returns null when Supabase isn't configured, the row doesn't exist yet,
 * or the request fails — callers should keep whatever they already have. */
export async function fetchDayEntry(
  userId: UserId,
  day: number,
): Promise<DayEntryFields | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseClient()!;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();
  if (error || !data) return null;
  return rowToFields(data as DayEntryRow);
}

/** Upserts a partial patch of vocab/notes fields for a user's course day.
 * No-ops when Supabase isn't configured — the caller's localStorage write
 * is the only persistence in that case. */
export async function upsertDayEntry(
  userId: UserId,
  day: number,
  patch: Partial<DayEntryFields>,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient()!;
  const columnPatch: Record<string, string> = {};
  if (patch.vocabWords !== undefined) columnPatch.vocab_words = patch.vocabWords;
  if (patch.vocabExample !== undefined) columnPatch.vocab_example = patch.vocabExample;
  if (patch.notes !== undefined) columnPatch.notes = patch.notes;

  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      day,
      ...columnPatch,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,day" },
  );
  if (error) {
    console.error("Failed to sync day entry to Supabase:", error.message);
  }
}

/** Subscribes to realtime changes to this user's entry for this specific
 * course day (e.g. edited from another device). Returns an unsubscribe
 * function; no-ops when Supabase isn't configured. */
export function subscribeToDayEntry(
  userId: UserId,
  day: number,
  onChange: (fields: DayEntryFields) => void,
): () => void {
  if (!isSupabaseConfigured()) return () => {};
  const supabase = getSupabaseClient()!;
  const channel = supabase
    .channel(`day_entry_${userId}_${day}_${Math.random().toString(36).slice(2)}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: TABLE,
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const row = payload.new as Partial<DayEntryRow> | undefined;
        if (row && row.day === day) {
          onChange(rowToFields(row as DayEntryRow));
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
