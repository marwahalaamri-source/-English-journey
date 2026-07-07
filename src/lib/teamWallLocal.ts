import type { UserId } from "./types";
import type { ReactionCounts, TeamMessage } from "./teamWallTypes";

const KEY = "ej_team_wall";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadMessages(): TeamMessage[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TeamMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: TeamMessage[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(messages));
  } catch {
    // storage unavailable — fail silently
  }
}

export function addMessage(userId: UserId, text: string): TeamMessage[] {
  const message: TeamMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    text,
    createdAt: new Date().toISOString(),
    reactions: { heart: 0, clap: 0, fire: 0 },
  };
  const next = [message, ...loadMessages()];
  saveMessages(next);
  return next;
}

export function reactToMessage(
  id: string,
  reaction: keyof ReactionCounts,
): TeamMessage[] {
  const next = loadMessages().map((m) =>
    m.id === id
      ? { ...m, reactions: { ...m.reactions, [reaction]: m.reactions[reaction] + 1 } }
      : m,
  );
  saveMessages(next);
  return next;
}

export function getLatestMessage(): TeamMessage | null {
  return loadMessages()[0] ?? null;
}
