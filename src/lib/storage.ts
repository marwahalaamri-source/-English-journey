import { todayStr } from "./date";
import { USERS } from "./users";
import type { Language, ThemeMode, UserId, UserProgress } from "./types";

const KEYS = {
  currentUser: "ej_current_user",
  theme: "ej_theme",
  language: "ej_language",
  progress: (id: UserId) => `ej_progress_${id}`,
};

function isBrowser() {
  return typeof window !== "undefined";
}

function safeGet(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable (e.g. private browsing quota) — fail silently
  }
}

export function getCurrentUserId(): UserId | null {
  const value = safeGet(KEYS.currentUser);
  return (value as UserId) ?? null;
}

export function setCurrentUserId(id: UserId | null) {
  if (id === null) {
    if (isBrowser()) window.localStorage.removeItem(KEYS.currentUser);
    return;
  }
  safeSet(KEYS.currentUser, id);
}

export function getStoredTheme(): ThemeMode | null {
  const value = safeGet(KEYS.theme);
  return value === "light" || value === "dark" ? value : null;
}

export function setStoredTheme(theme: ThemeMode) {
  safeSet(KEYS.theme, theme);
}

export function getStoredLanguage(): Language | null {
  const value = safeGet(KEYS.language);
  return value === "en" || value === "ar" ? value : null;
}

export function setStoredLanguage(lang: Language) {
  safeSet(KEYS.language, lang);
}

function createInitialProgress(id: UserId, name: string): UserProgress {
  return {
    userId: id,
    displayName: name,
    startDate: todayStr(),
    xp: 0,
    streak: 0,
    longestStreak: 0,
    totalMinutes: 0,
    lastCompletedDate: null,
    taskCounts: {},
    history: {},
    unlockedAchievements: {},
  };
}

export function loadProgress(id: UserId): UserProgress {
  const raw = safeGet(KEYS.progress(id));
  if (!raw) {
    const meta = USERS.find((u) => u.id === id);
    const fresh = createInitialProgress(id, meta?.name ?? id);
    safeSet(KEYS.progress(id), JSON.stringify(fresh));
    return fresh;
  }
  try {
    const parsed = JSON.parse(raw) as UserProgress;
    return {
      ...createInitialProgress(id, parsed.displayName ?? id),
      ...parsed,
    };
  } catch {
    const meta = USERS.find((u) => u.id === id);
    return createInitialProgress(id, meta?.name ?? id);
  }
}

export function saveProgress(progress: UserProgress) {
  safeSet(KEYS.progress(progress.userId), JSON.stringify(progress));
}

export function loadAllProgress(): Record<UserId, UserProgress> {
  const result = {} as Record<UserId, UserProgress>;
  for (const user of USERS) {
    result[user.id] = loadProgress(user.id);
  }
  return result;
}

export function resetProgress(id: UserId, name: string): UserProgress {
  const fresh = createInitialProgress(id, name);
  saveProgress(fresh);
  return fresh;
}
