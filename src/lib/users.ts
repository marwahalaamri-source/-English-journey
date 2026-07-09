import type { UserId } from "./types";

export interface UserMeta {
  id: UserId;
  name: string;
  color: string;
  emoji: string;
}

export const USERS: UserMeta[] = [
  { id: "marwah", name: "Marwah", color: "#7FC7EA", emoji: "🌸" },
  { id: "ebtehal", name: "Ebtehal", color: "#F2C79C", emoji: "🌼" },
  { id: "meead", name: "Miad", color: "#A7D8C5", emoji: "🌿" },
  { id: "fatimah", name: "Fatimah", color: "#E3B6C9", emoji: "🌷" },
];

export function getUserMeta(id: UserId): UserMeta {
  const user = USERS.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown user id: ${id}`);
  return user;
}

const DISPLAY_NAME_TO_ID: Record<string, UserId> = Object.fromEntries(
  USERS.map((u) => [u.name.toLowerCase(), u.id]),
);

/**
 * Maps a raw, untrusted id string (e.g. a Supabase row's user_id) to one of
 * the 4 known canonical ids, or null if it doesn't match anything. Matches
 * case-insensitively against both the id itself and each user's display
 * name — Miad's canonical id is "meead" (kept for storage-key stability
 * when she was renamed from "Meead"), so a stray row saved as "miad" or
 * "Miad" (e.g. hand-typed into the Supabase Table Editor, where only the
 * display name is visible) would otherwise silently read as a different,
 * unrecognized person instead of the same one.
 */
export function normalizeUserId(rawId: string): UserId | null {
  const lower = rawId.trim().toLowerCase();
  if (!lower) return null;
  const byId = USERS.find((u) => u.id === lower);
  if (byId) return byId.id;
  return DISPLAY_NAME_TO_ID[lower] ?? null;
}

/**
 * Same lookup as getUserMeta, but never throws and normalizes aliases (see
 * normalizeUserId) before falling back. Use this for data sourced from
 * Supabase (Team Wall messages, day entries) — the RLS policy allows
 * inserting any user_id string, so it can't be trusted to always match one
 * of the 4 known profiles verbatim.
 */
export function getUserMetaOrFallback(id: string): UserMeta {
  const canonical = normalizeUserId(id);
  if (canonical) return getUserMeta(canonical);
  return { id: id as UserId, name: id || "?", color: "#CBBFA8", emoji: "❓" };
}
