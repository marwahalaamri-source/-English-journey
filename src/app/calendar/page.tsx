"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { getMonthMatrix, parseDate, todayStr } from "@/lib/date";
import {
  getDayRecord,
  isFullyCompleted,
  requiredCompletedCount,
} from "@/lib/selectors";
import { REQUIRED_TASK_COUNT } from "@/lib/tasks";

const WEEKDAYS: Record<"en" | "ar", string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمعة", "سبت"],
};

export default function CalendarPage() {
  const { progress, language, t } = useApp();
  const today = todayStr();
  const [cursor, setCursor] = useState(() => {
    const d = parseDate(today);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(today);

  const weeks = useMemo(
    () => getMonthMatrix(cursor.year, cursor.month),
    [cursor],
  );

  if (!progress) return null;

  const history = progress.history;
  const selectedRecord = getDayRecord(history, selectedDate);

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    { month: "long", year: "numeric" },
  );

  function goToMonth(delta: number) {
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function cellStyle(dateStr: string | null) {
    if (!dateStr) return "";
    const record = history[dateStr];
    if (dateStr === today) {
      if (isFullyCompleted(record)) return "bg-accent-strong text-white";
      return "bg-surface border-2 border-accent-strong text-ink";
    }
    if (isFullyCompleted(record)) return "bg-accent-strong text-white";
    if (record && record.completedTaskIds.length > 0)
      return "bg-accent-soft text-accent-strong";
    return "bg-cream-soft text-ink-muted";
  }

  return (
    <div className="pb-4">
      <PageHeader
        title={t((d) => d.calendar.title)}
        subtitle={t((d) => d.calendar.subtitle)}
      />

      <div className="card-shadow rounded-2xl bg-surface border border-border p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => goToMonth(-1)}
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center bg-cream-soft text-ink"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold text-ink">{monthLabel}</span>
          <button
            onClick={() => goToMonth(1)}
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center bg-cream-soft text-ink"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS[language].map((wd) => (
            <div
              key={wd}
              className="text-center text-[10px] font-semibold text-ink-muted"
            >
              {wd}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1.5">
              {week.map((dateStr, di) => (
                <button
                  key={di}
                  disabled={!dateStr}
                  onClick={() => dateStr && setSelectedDate(dateStr)}
                  className={`tap-scale aspect-square rounded-xl text-xs font-semibold flex items-center justify-center ${
                    dateStr ? cellStyle(dateStr) : ""
                  } ${
                    dateStr === selectedDate
                      ? "ring-2 ring-offset-1 ring-accent-strong ring-offset-cream"
                      : ""
                  }`}
                >
                  {dateStr ? Number(dateStr.slice(-2)) : ""}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent-strong" />
            {t((d) => d.calendar.legendFull)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent-soft" />
            {t((d) => d.calendar.legendPartial)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cream-soft border border-border" />
            {t((d) => d.calendar.legendNone)}
          </span>
        </div>
      </div>

      <div className="card-shadow rounded-2xl bg-surface border border-border p-4">
        <div className="font-semibold text-ink mb-3">{selectedDate}</div>
        {selectedRecord.completedTaskIds.length === 0 ? (
          <p className="text-sm text-ink-muted">
            {t((d) => d.calendar.noActivity)}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-ink">
                {requiredCompletedCount(selectedRecord)}/{REQUIRED_TASK_COUNT}
              </div>
              <div className="text-[11px] text-ink-muted">
                {t((d) => d.calendar.tasksCompleted)}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-ink">
                {selectedRecord.minutes}
              </div>
              <div className="text-[11px] text-ink-muted">
                {t((d) => d.calendar.minutesLogged)}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-ink">
                {selectedRecord.xpEarned}
              </div>
              <div className="text-[11px] text-ink-muted">
                {t((d) => d.calendar.xpEarned)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
