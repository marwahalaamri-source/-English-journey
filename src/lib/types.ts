export type UserId = "marwah" | "ebtehal" | "meead" | "fatimah";

export type TaskId =
  | "listening"
  | "vocabulary"
  | "vocabularyReview"
  | "grammar"
  | "grammarReview"
  | "reading"
  | "speaking"
  | "aiFeedback"
  | "shadowing";

export interface TaskDefinition {
  id: TaskId;
  minutes: number;
  xp: number;
  optional?: boolean;
  icon: string;
  resourceUrl?: string;
}

export type MonthKey = "foundation" | "confidence" | "fluency";

export interface DayRecord {
  date: string; // YYYY-MM-DD
  completedTaskIds: TaskId[];
  minutes: number;
  xpEarned: number;
}

export interface UserProgress {
  userId: UserId;
  displayName: string;
  startDate: string; // YYYY-MM-DD, first day the user opened the app
  xp: number;
  streak: number;
  longestStreak: number;
  totalMinutes: number;
  lastCompletedDate: string | null;
  taskCounts: Partial<Record<TaskId, number>>;
  history: Record<string, DayRecord>;
  unlockedAchievements: Record<string, string>; // achievementId -> date unlocked
}

export type Language = "en" | "ar";
export type ThemeMode = "light" | "dark";
