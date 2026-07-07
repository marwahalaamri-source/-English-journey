import { getSupabaseClient, isSupabaseConfigured, withTimeout } from "./supabaseClient";

const NETWORK_TIMEOUT_MS = 8000;
import * as local from "./teamWallLocal";
import type { UserId } from "./types";
import type { ReactionCounts, TeamMessage } from "./teamWallTypes";

export type { ReactionCounts, TeamMessage } from "./teamWallTypes";

const TABLE = "team_messages";

const REACTION_COLUMNS: Record<keyof ReactionCounts, string> = {
  heart: "heart_count",
  clap: "clap_count",
  fire: "fire_count",
};

interface TeamMessageRow {
  id: string;
  user_id: UserId;
  text: string;
  created_at: string;
  heart_count: number;
  clap_count: number;
  fire_count: number;
}

// Defensive: a row could have been inserted by hand (e.g. via the Supabase
// Table Editor while testing) with missing/null fields the schema's NOT
// NULL defaults wouldn't apply to an explicit null. Never let a malformed
// row crash rendering — coalesce to safe values instead.
function rowToMessage(row: TeamMessageRow): TeamMessage {
  return {
    id: row.id ?? "",
    userId: row.user_id ?? "",
    text: row.text ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
    reactions: {
      heart: row.heart_count ?? 0,
      clap: row.clap_count ?? 0,
      fire: row.fire_count ?? 0,
    },
  };
}

export async function loadMessages(): Promise<TeamMessage[]> {
  if (!isSupabaseConfigured()) return local.loadMessages();
  const supabase = getSupabaseClient()!;
  const { data, error } = await withTimeout(
    supabase.from(TABLE).select("*").order("created_at", { ascending: false }),
    NETWORK_TIMEOUT_MS,
    { data: null, error: new Error("Timed out reaching Supabase") },
  );
  if (error) {
    console.error("Failed to load team messages from Supabase:", error.message);
    return [];
  }
  return (data as TeamMessageRow[]).map(rowToMessage);
}

export async function addMessage(
  userId: UserId,
  text: string,
): Promise<TeamMessage[]> {
  if (!isSupabaseConfigured()) return local.addMessage(userId, text);
  const supabase = getSupabaseClient()!;
  const { error } = await withTimeout(
    supabase.from(TABLE).insert({ user_id: userId, text }),
    NETWORK_TIMEOUT_MS,
    { error: new Error("Timed out reaching Supabase") },
  );
  if (error) {
    console.error("Failed to post team message to Supabase:", error.message);
  }
  return loadMessages();
}

export async function reactToMessage(
  id: string,
  reaction: keyof ReactionCounts,
): Promise<TeamMessage[]> {
  if (!isSupabaseConfigured()) return local.reactToMessage(id, reaction);
  const supabase = getSupabaseClient()!;
  const column = REACTION_COLUMNS[reaction];

  const { data: current, error: readError } = await withTimeout(
    supabase.from(TABLE).select(column).eq("id", id).single(),
    NETWORK_TIMEOUT_MS,
    { data: null, error: new Error("Timed out reaching Supabase") },
  );

  if (!readError && current) {
    const currentCount = (current as unknown as Record<string, number>)[column] ?? 0;
    const { error: updateError } = await withTimeout(
      supabase.from(TABLE).update({ [column]: currentCount + 1 }).eq("id", id),
      NETWORK_TIMEOUT_MS,
      { error: new Error("Timed out reaching Supabase") },
    );
    if (updateError) {
      console.error("Failed to react to team message:", updateError.message);
    }
  }

  return loadMessages();
}

export async function getLatestMessage(): Promise<TeamMessage | null> {
  const messages = await loadMessages();
  return messages[0] ?? null;
}

/**
 * Subscribes to live inserts/updates on the team wall so messages posted
 * from other devices show up without a manual refresh. Returns an
 * unsubscribe function. No-ops (and never fires) when Supabase isn't
 * configured, since localStorage has no cross-device events to listen for.
 */
export function subscribeToMessages(onChange: () => void): () => void {
  if (!isSupabaseConfigured()) return () => {};
  const supabase = getSupabaseClient()!;
  const channel = supabase
    .channel(`team_messages_changes_${Math.random().toString(36).slice(2)}`)
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
