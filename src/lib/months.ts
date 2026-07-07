import type { MonthKey } from "./types";

export const DAYS_PER_MONTH = 30;
export const TOTAL_JOURNEY_DAYS = 90;

export interface MonthMeta {
  index: 1 | 2 | 3;
  key: MonthKey;
}

export const MONTHS: MonthMeta[] = [
  { index: 1, key: "foundation" },
  { index: 2, key: "confidence" },
  { index: 3, key: "fluency" },
];

export function getMonthIndex(day: number): 1 | 2 | 3 {
  const clamped = Math.min(Math.max(day, 1), TOTAL_JOURNEY_DAYS);
  return Math.ceil(clamped / DAYS_PER_MONTH) as 1 | 2 | 3;
}

export function getDayInMonth(day: number): number {
  const clamped = Math.min(Math.max(day, 1), TOTAL_JOURNEY_DAYS);
  return clamped - (getMonthIndex(day) - 1) * DAYS_PER_MONTH;
}

export function getMonthKey(day: number): MonthKey {
  return MONTHS[getMonthIndex(day) - 1].key;
}
