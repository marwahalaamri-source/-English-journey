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
  { id: "meead", name: "Meead", color: "#A7D8C5", emoji: "🌿" },
  { id: "fatimah", name: "Fatimah", color: "#E3B6C9", emoji: "🌷" },
];

export function getUserMeta(id: UserId): UserMeta {
  const user = USERS.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown user id: ${id}`);
  return user;
}
