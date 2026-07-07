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

/**
 * Same lookup, but never throws. Use this for data sourced from Supabase
 * (Team Wall messages, day entries) — the RLS policy allows inserting any
 * user_id string, so it can't be trusted to always match one of the 4
 * known profiles (e.g. a manually-added test row in the Table Editor).
 */
export function getUserMetaOrFallback(id: string): UserMeta {
  const user = USERS.find((u) => u.id === id);
  if (user) return user;
  return { id: id as UserId, name: id || "?", color: "#CBBFA8", emoji: "❓" };
}
