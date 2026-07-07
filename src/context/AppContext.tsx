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
import { dictionaries, interpolate, type Dictionary } from "@/lib/i18n";
import { deriveStats, toggleTaskInHistory, type DerivedStats } from "@/lib/selectors";
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
import type { Language, TaskId, ThemeMode, UserId, UserProgress } from "@/lib/types";

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
        return next;
      });
    },
    [],
  );

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
