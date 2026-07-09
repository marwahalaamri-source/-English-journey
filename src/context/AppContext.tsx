"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { todayStr } from "@/lib/date";
import { computeUnlockedIds } from "@/lib/achievements";
import { upsertDayEntry } from "@/lib/dayEntries";
import {
  fetchRemoteProgressForUser,
  subscribeToUserProgress,
  upsertRemoteProgress,
} from "@/lib/progressSync";
import { dictionaries, interpolate, type Dictionary } from "@/lib/i18n";
import {
  deriveStats,
  toggleTaskInHistory,
  updateDayJournal as updateDayJournalInHistory,
  type DerivedStats,
} from "@/lib/selectors";
import {
  getCurrentUserId,
  getStoredLanguage,
  getStoredTheme,
  loadProgress,
  resetProgress,
  saveProgress,
  setCurrentUserId,
  setStoredLanguage,
  setStoredTheme,
} from "@/lib/storage";
import { getUserMeta, USERS } from "@/lib/users";
import type {
  DayRecord,
  Language,
  TaskId,
  ThemeMode,
  UserId,
  UserProgress,
} from "@/lib/types";

interface AppContextValue {
  mounted: boolean;
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  currentUserId: UserId | null;
  progress: UserProgress | null;
  stats: DerivedStats | null;
  selectUser: (id: UserId) => void;
  switchToPicker: () => void;
  toggleTask: (day: number, taskId: TaskId) => void;
  updateDayJournal: (
    day: number,
    patch: Partial<Pick<DayRecord, "vocabWords" | "vocabExample" | "notes">>,
  ) => void;
  applyRemoteDayJournal: (
    day: number,
    patch: Partial<Pick<DayRecord, "vocabWords" | "vocabExample" | "notes">>,
  ) => void;
  updateDisplayName: (name: string) => void;
  resetMyProgress: () => void;
  t: (selector: (d: Dictionary) => string, vars?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [currentUserId, setCurrentUserIdState] = useState<UserId | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  // One-time hydration from localStorage: intentionally runs only after
  // mount so the server-rendered markup matches the first client paint.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedLang = getStoredLanguage() ?? "en";
    const storedTheme =
      getStoredTheme() ??
      (typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const storedUser = getCurrentUserId();

    setLanguageState(storedLang);
    setThemeState(storedTheme);
    setCurrentUserIdState(storedUser);
    if (storedUser) {
      setProgress(loadProgress(storedUser));
    }
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", language);
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    setStoredTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      setStoredTheme(next);
      return next;
    });
  }, []);

  const selectUser = useCallback((id: UserId) => {
    setCurrentUserId(id);
    setCurrentUserIdState(id);
    setProgress(loadProgress(id));
  }, []);

  const switchToPicker = useCallback(() => {
    setCurrentUserId(null);
    setCurrentUserIdState(null);
    setProgress(null);
  }, []);

  const toggleTask = useCallback(
    (day: number, taskId: TaskId) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const today = todayStr();
        const history = toggleTaskInHistory(prev.history, day, taskId, today);
        const stats = deriveStats({ history }, today);
        const unlockedIds = computeUnlockedIds(stats);
        const unlockedAchievements = { ...prev.unlockedAchievements };
        for (const id of unlockedIds) {
          if (!unlockedAchievements[id]) {
            unlockedAchievements[id] = today;
          }
        }
        const next: UserProgress = { ...prev, history, unlockedAchievements };
        saveProgress(next);
        // Fire-and-forget cross-device sync so the Team page can reflect
        // this user's latest XP/streak/completion on other devices;
        // localStorage above is the instant, offline-safe write and stays
        // the fallback if this fails or Supabase isn't configured.
        upsertRemoteProgress(next.userId, history, unlockedAchievements);
        return next;
      });
    },
    [],
  );

  const updateDayJournal = useCallback(
    (
      day: number,
      patch: Partial<Pick<DayRecord, "vocabWords" | "vocabExample" | "notes">>,
    ) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const history = updateDayJournalInHistory(prev.history, day, patch);
        const next: UserProgress = { ...prev, history };
        saveProgress(next);
        // Fire-and-forget cross-device sync; localStorage above is the
        // instant, offline-safe write and stays the fallback if this fails
        // or Supabase isn't configured.
        upsertDayEntry(prev.userId, day, patch);
        return next;
      });
    },
    [],
  );

  // Applies a journal patch that originated from Supabase (initial fetch or
  // a realtime row change) to local state/localStorage only. Never calls
  // upsertDayEntry: doing so would write the just-received row straight back
  // to Supabase, which re-triggers the same realtime event and loops forever
  // (each upsert bumps `updated_at`, so it's never a no-op to Postgres).
  const applyRemoteDayJournal = useCallback(
    (
      day: number,
      patch: Partial<Pick<DayRecord, "vocabWords" | "vocabExample" | "notes">>,
    ) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const history = updateDayJournalInHistory(prev.history, day, patch);
        const next: UserProgress = { ...prev, history };
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  // Same idea as applyRemoteDayJournal, but for the whole progress blob:
  // local state/localStorage only, never re-uploads (that would echo the
  // write straight back to Supabase and loop).
  const applyRemoteProgress = useCallback(
    (history: Record<number, DayRecord>, unlockedAchievements: Record<string, string>) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const next: UserProgress = { ...prev, history, unlockedAchievements };
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  // Reconciles this device's copy of the signed-in user's own progress with
  // Supabase. Without this, only *other* users' Team page rows ever read
  // from Supabase — this device's own row could keep showing whatever was
  // last saved locally (e.g. before this same person used a different
  // phone), permanently disagreeing with what everyone else sees for them.
  // Runs once when a profile is picked/hydrated, then keeps listening so a
  // change made on another of this person's own devices catches up here
  // too. A local edit made *after* this effect's initial fetch is safe:
  // toggleTask/updateDayJournal always write through to Supabase, so any
  // later echo received here reflects that same edit, not a rollback.
  useEffect(() => {
    if (!mounted || !currentUserId) return;
    const userId = currentUserId;
    let cancelled = false;

    async function syncFromRemote() {
      const remote = await fetchRemoteProgressForUser(userId);
      if (!cancelled && remote) {
        applyRemoteProgress(remote.history, remote.unlockedAchievements);
      }
    }
    syncFromRemote();

    const unsubscribe = subscribeToUserProgress(userId, (remote) => {
      if (!cancelled) applyRemoteProgress(remote.history, remote.unlockedAchievements);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [mounted, currentUserId, applyRemoteProgress]);

  const updateDisplayName = useCallback((name: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      const next = { ...prev, displayName: name };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetMyProgress = useCallback(() => {
    setProgress((prev) => {
      if (!prev) return prev;
      const fresh = resetProgress(prev.userId, prev.displayName);
      upsertRemoteProgress(fresh.userId, fresh.history, fresh.unlockedAchievements);
      return fresh;
    });
  }, []);

  const t = useCallback(
    (selector: (d: Dictionary) => string, vars?: Record<string, string | number>) => {
      const value = selector(dictionaries[language]);
      return interpolate(value, vars);
    },
    [language],
  );

  const stats = useMemo(() => {
    if (!progress) return null;
    return deriveStats(progress, todayStr());
  }, [progress]);

  const value: AppContextValue = {
    mounted,
    language,
    dir: language === "ar" ? "rtl" : "ltr",
    setLanguage,
    theme,
    setTheme,
    toggleTheme,
    currentUserId,
    progress,
    stats,
    selectUser,
    switchToPicker,
    toggleTask,
    updateDayJournal,
    applyRemoteDayJournal,
    updateDisplayName,
    resetMyProgress,
    t,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useCurrentUserMeta() {
  const { currentUserId } = useApp();
  return currentUserId ? getUserMeta(currentUserId) : null;
}

export { USERS };
