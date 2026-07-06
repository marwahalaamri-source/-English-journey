import type { DerivedStats } from "./selectors";

export interface AchievementDefinition {
  id: string;
  icon: string;
  isUnlocked: (stats: DerivedStats) => boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "firstStep",
    icon: "Footprints",
    isUnlocked: (s) => s.todayRecord.completedTaskIds.length > 0 || s.xp > 0,
  },
  {
    id: "perfectDay",
    icon: "CheckCircle2",
    isUnlocked: (s) => s.todayProgressPercent >= 100,
  },
  {
    id: "streak3",
    icon: "Flame",
    isUnlocked: (s) => s.longestStreak >= 3,
  },
  {
    id: "streak7",
    icon: "Flame",
    isUnlocked: (s) => s.longestStreak >= 7,
  },
  {
    id: "streak30",
    icon: "Flame",
    isUnlocked: (s) => s.longestStreak >= 30,
  },
  {
    id: "xp500",
    icon: "Star",
    isUnlocked: (s) => s.xp >= 500,
  },
  {
    id: "xp1000",
    icon: "Sparkles",
    isUnlocked: (s) => s.xp >= 1000,
  },
  {
    id: "xp5000",
    icon: "Trophy",
    isUnlocked: (s) => s.xp >= 5000,
  },
  {
    id: "marathoner",
    icon: "Timer",
    isUnlocked: (s) => s.totalMinutes >= 500,
  },
  {
    id: "bookworm",
    icon: "BookMarked",
    isUnlocked: (s) => (s.taskCounts.reading ?? 0) >= 20,
  },
  {
    id: "chatterbox",
    icon: "Mic",
    isUnlocked: (s) => (s.taskCounts.speaking ?? 0) >= 20,
  },
  {
    id: "dedicated",
    icon: "CalendarCheck",
    isUnlocked: (s) => s.day >= 30,
  },
];

export function computeUnlockedIds(stats: DerivedStats): string[] {
  return ACHIEVEMENTS.filter((a) => a.isUnlocked(stats)).map((a) => a.id);
}
