import { REQUIRED_TASKS, REQUIRED_TASK_COUNT, TASK_MAP } from "./tasks";
import { addDays } from "./date";
import {
  DAYS_PER_MONTH,
  TOTAL_JOURNEY_DAYS,
  getDayInMonth,
  getMonthIndex,
} from "./months";
import type { DayRecord, TaskId, UserProgress } from "./types";

export function emptyDayRecord(): DayRecord {
  return {
    completedTaskIds: [],
    minutes: 0,
    xpEarned: 0,
    datesTouched: [],
    vocabWords: "",
    vocabExample: "",
    notes: "",
  };
}

export function getDayRecord(
  history: Record<number, DayRecord>,
  day: number,
): DayRecord {
  const stored = history[day];
  if (!stored) return emptyDayRecord();
  // Merge over defaults so records saved before a field existed still work.
  return { ...emptyDayRecord(), ...stored };
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

export function dayProgressPercent(record: DayRecord | undefined): number {
  return Math.round((requiredCompletedCount(record) / REQUIRED_TASK_COUNT) * 100);
}

/** The first day (1-90) that isn't fully completed yet — where the
 * learner should resume. Clamped to the last day once everything is done. */
export function findCurrentDay(history: Record<number, DayRecord>): number {
  for (let day = 1; day <= TOTAL_JOURNEY_DAYS; day++) {
    if (!isFullyCompleted(history[day])) return day;
  }
  return TOTAL_JOURNEY_DAYS;
}

export function computeStreakStats(
  activityDates: Set<string>,
  today: string,
): { streak: number; longestStreak: number } {
  let cursor = today;
  if (!activityDates.has(cursor)) {
    cursor = addDays(cursor, -1);
  }
  let streak = 0;
  while (activityDates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...activityDates].sort();
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

export function computeActivityDates(
  history: Record<number, DayRecord>,
): Set<string> {
  const dates = new Set<string>();
  for (const record of Object.values(history)) {
    for (const d of record.datesTouched) dates.add(d);
  }
  return dates;
}

export function computeTotals(history: Record<number, DayRecord>) {
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

function completionPercentInRange(
  history: Record<number, DayRecord>,
  startDay: number,
  endDay: number,
): number {
  let done = 0;
  for (let day = startDay; day <= endDay; day++) {
    done += requiredCompletedCount(history[day]);
  }
  const total = (endDay - startDay + 1) * REQUIRED_TASK_COUNT;
  return Math.round((done / total) * 100);
}

export function monthCompletionPercent(
  history: Record<number, DayRecord>,
  monthIndex: 1 | 2 | 3,
): number {
  const start = (monthIndex - 1) * DAYS_PER_MONTH + 1;
  const end = monthIndex * DAYS_PER_MONTH;
  return completionPercentInRange(history, start, end);
}

export function overallCompletionPercent(
  history: Record<number, DayRecord>,
): number {
  return completionPercentInRange(history, 1, TOTAL_JOURNEY_DAYS);
}

export interface DerivedStats {
  xp: number;
  totalMinutes: number;
  streak: number;
  longestStreak: number;
  taskCounts: Partial<Record<TaskId, number>>;
  day: number;
  monthIndex: 1 | 2 | 3;
  dayInMonth: number;
  overallCompletionPercent: number;
  monthCompletionPercent: number;
  today: string;
  currentDayRecord: DayRecord;
  currentDayProgressPercent: number;
}

export function deriveStats(
  progress: Pick<UserProgress, "history">,
  today: string,
): DerivedStats {
  const { xp, minutes, taskCounts } = computeTotals(progress.history);
  const activityDates = computeActivityDates(progress.history);
  const { streak, longestStreak } = computeStreakStats(activityDates, today);
  const day = findCurrentDay(progress.history);
  const currentDayRecord = getDayRecord(progress.history, day);
  const monthIndex = getMonthIndex(day);

  return {
    xp,
    totalMinutes: minutes,
    streak,
    longestStreak,
    taskCounts,
    day,
    monthIndex,
    dayInMonth: getDayInMonth(day),
    overallCompletionPercent: overallCompletionPercent(progress.history),
    monthCompletionPercent: monthCompletionPercent(progress.history, monthIndex),
    today,
    currentDayRecord,
    currentDayProgressPercent: dayProgressPercent(currentDayRecord),
  };
}

export function toggleTaskInHistory(
  history: Record<number, DayRecord>,
  day: number,
  taskId: TaskId,
  today: string,
): Record<number, DayRecord> {
  const existing = getDayRecord(history, day);
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

  const datesTouched =
    !isCompleted && !existing.datesTouched.includes(today)
      ? [...existing.datesTouched, today]
      : existing.datesTouched;

  const updated: DayRecord = {
    ...existing,
    completedTaskIds,
    minutes: Math.max(0, minutes),
    xpEarned: Math.max(0, xpEarned),
    datesTouched,
  };

  return { ...history, [day]: updated };
}

export function updateDayJournal(
  history: Record<number, DayRecord>,
  day: number,
  patch: Partial<Pick<DayRecord, "vocabWords" | "vocabExample" | "notes">>,
): Record<number, DayRecord> {
  const existing = getDayRecord(history, day);
  return { ...history, [day]: { ...existing, ...patch } };
}
