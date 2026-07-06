import { REQUIRED_TASKS, REQUIRED_TASK_COUNT, TASK_MAP } from "./tasks";
import { addDays, dayNumber as computeDayNumber } from "./date";
import type { DayRecord, TaskId, UserProgress } from "./types";

export function emptyDayRecord(date: string): DayRecord {
  return { date, completedTaskIds: [], minutes: 0, xpEarned: 0 };
}

export function getDayRecord(
  history: Record<string, DayRecord>,
  date: string,
): DayRecord {
  return history[date] ?? emptyDayRecord(date);
}

export function isFullyCompleted(record: DayRecord | undefined): boolean {
  if (!record) return false;
  return REQUIRED_TASKS.every((t) => record.completedTaskIds.includes(t.id));
}

export function requiredCompletedCount(record: DayRecord | undefined): number {
  if (!record) return 0;
  return REQUIRED_TASKS.filter((t) => record.completedTaskIds.includes(t.id))
    .length;
}

export function todayProgressPercent(record: DayRecord | undefined): number {
  return Math.round((requiredCompletedCount(record) / REQUIRED_TASK_COUNT) * 100);
}

export function computeStreakStats(
  history: Record<string, DayRecord>,
  today: string,
): { streak: number; longestStreak: number } {
  const completedDates = new Set(
    Object.keys(history).filter((d) => isFullyCompleted(history[d])),
  );

  let cursor = today;
  if (!completedDates.has(cursor)) {
    cursor = addDays(cursor, -1);
  }
  let streak = 0;
  while (completedDates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...completedDates].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && addDays(prev, 1) === d) {
      run++;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  return { streak, longestStreak: Math.max(longest, streak) };
}

export function computeTotals(history: Record<string, DayRecord>) {
  let xp = 0;
  let minutes = 0;
  const taskCounts: Partial<Record<TaskId, number>> = {};

  for (const record of Object.values(history)) {
    xp += record.xpEarned;
    minutes += record.minutes;
    for (const taskId of record.completedTaskIds) {
      taskCounts[taskId] = (taskCounts[taskId] ?? 0) + 1;
    }
  }

  return { xp, minutes, taskCounts };
}

export interface DerivedStats {
  xp: number;
  totalMinutes: number;
  streak: number;
  longestStreak: number;
  taskCounts: Partial<Record<TaskId, number>>;
  day: number;
  today: string;
  todayRecord: DayRecord;
  todayProgressPercent: number;
  todayMinutes: number;
}

export function deriveStats(
  progress: Pick<UserProgress, "startDate" | "history">,
  today: string,
): DerivedStats {
  const { xp, minutes, taskCounts } = computeTotals(progress.history);
  const { streak, longestStreak } = computeStreakStats(progress.history, today);
  const todayRecord = getDayRecord(progress.history, today);

  return {
    xp,
    totalMinutes: minutes,
    streak,
    longestStreak,
    taskCounts,
    day: computeDayNumber(progress.startDate, today),
    today,
    todayRecord,
    todayProgressPercent: todayProgressPercent(todayRecord),
    todayMinutes: todayRecord.minutes,
  };
}

export function toggleTaskInHistory(
  history: Record<string, DayRecord>,
  date: string,
  taskId: TaskId,
): Record<string, DayRecord> {
  const existing = getDayRecord(history, date);
  const task = TASK_MAP[taskId];
  const isCompleted = existing.completedTaskIds.includes(taskId);

  const completedTaskIds = isCompleted
    ? existing.completedTaskIds.filter((id) => id !== taskId)
    : [...existing.completedTaskIds, taskId];

  const minutes = isCompleted
    ? existing.minutes - task.minutes
    : existing.minutes + task.minutes;

  const xpEarned = isCompleted
    ? existing.xpEarned - task.xp
    : existing.xpEarned + task.xp;

  const updated: DayRecord = {
    date,
    completedTaskIds,
    minutes: Math.max(0, minutes),
    xpEarned: Math.max(0, xpEarned),
  };

  return { ...history, [date]: updated };
}
