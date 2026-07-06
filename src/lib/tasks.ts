import type { TaskDefinition, TaskId } from "./types";

export const TASKS: TaskDefinition[] = [
  { id: "listening", minutes: 30, xp: 30, icon: "Headphones" },
  { id: "vocabulary", minutes: 5, xp: 10, icon: "BookOpen" },
  { id: "vocabularyReview", minutes: 5, xp: 10, icon: "RotateCcw" },
  { id: "grammar", minutes: 5, xp: 10, icon: "SpellCheck" },
  { id: "grammarReview", minutes: 5, xp: 10, icon: "RefreshCw" },
  { id: "reading", minutes: 10, xp: 15, icon: "BookMarked" },
  { id: "speaking", minutes: 5, xp: 15, icon: "Mic" },
  { id: "aiFeedback", minutes: 10, xp: 15, icon: "Sparkles" },
  { id: "shadowing", minutes: 10, xp: 10, optional: true, icon: "AudioLines" },
];

export const REQUIRED_TASKS = TASKS.filter((t) => !t.optional);
export const OPTIONAL_TASKS = TASKS.filter((t) => t.optional);

export const TASK_MAP: Record<TaskId, TaskDefinition> = TASKS.reduce(
  (acc, task) => {
    acc[task.id] = task;
    return acc;
  },
  {} as Record<TaskId, TaskDefinition>,
);

export const REQUIRED_TASK_COUNT = REQUIRED_TASKS.length;
export const TOTAL_DAILY_MINUTES = TASKS.reduce((sum, t) => sum + t.minutes, 0);
export const REQUIRED_DAILY_MINUTES = REQUIRED_TASKS.reduce(
  (sum, t) => sum + t.minutes,
  0,
);
