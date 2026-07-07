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

/** A single course day (1-90). Days are self-paced: any day can be
 * completed in any order, independent of the real calendar date. */
export interface DayRecord {
  completedTaskIds: TaskId[];
  minutes: number;
  xpEarned: number;
  /** Real calendar dates (YYYY-MM-DD) on which this day received any
   * completion. Used only to derive the activity streak. */
  datesTouched: string[];
  /** New vocabulary words the learner wrote down for this day. */
  vocabWords: string;
  /** One example sentence using a new word from this day. */
  vocabExample: string;
  /** Free-form private notes for this day. */
  notes: string;
}

export interface UserProgress {
  userId: UserId;
  displayName: string;
  startDate: string; // YYYY-MM-DD, first day the user opened the app
  history: Record<number, DayRecord>; // keyed by course day 1-90
  unlockedAchievements: Record<string, string>; // achievementId -> date unlocked
}

export type Language = "en" | "ar";
export type ThemeMode = "light" | "dark";
