"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  DAYS_PER_MONTH,
  MONTHS,
  globalDayFromMonthAndLocal,
  isValidMonthIndex,
} from "@/lib/months";
import { getDayRecord, isFullyCompleted, requiredCompletedCount } from "@/lib/selectors";
import { REQUIRED_TASK_COUNT } from "@/lib/tasks";

export default function MonthPage() {
  const params = useParams<{ month: string }>();
  const monthIndex = Number(params.month);
  const { progress, stats, t } = useApp();

  if (!isValidMonthIndex(monthIndex)) notFound();
  if (!progress || !stats) return null;

  const monthMeta = MONTHS[monthIndex - 1];
  const title = t((d) => d.months[monthMeta.key].title);
  const tagline = t((d) => d.months[monthMeta.key].tagline);
  const days = Array.from({ length: DAYS_PER_MONTH }, (_, i) => i + 1);

  return (
    <div className="pb-4">
      <Link
        href="/journey"
        className="inline-flex items-center gap-1 text-sm text-ink-muted mb-4"
      >
        <ChevronLeft size={15} className="rtl:rotate-180" />
        {t((d) => d.journey.allMonths)}
      </Link>

      <p className="text-[11px] uppercase tracking-wide font-medium text-ink-muted mb-1.5">
        {t((d) => d.common.month)} {monthIndex}
      </p>
      <h1 className="font-serif italic text-3xl text-ink mb-1">{title}</h1>
      <p className="text-sm text-ink-muted mb-6">{tagline}</p>

      <div className="grid grid-cols-5 gap-2.5">
        {days.map((localDay) => {
          const globalDay = globalDayFromMonthAndLocal(monthIndex, localDay);
          const record = getDayRecord(progress.history, globalDay);
          const done = requiredCompletedCount(record);
          const full = isFullyCompleted(record);
          const isCurrent = globalDay === stats.day;

          return (
            <Link
              key={globalDay}
              href={`/journey/${monthIndex}/${globalDay}`}
              className={`tap-scale aspect-square rounded-xl border p-2 flex flex-col items-start justify-between ${
                full
                  ? "bg-accent-strong border-accent-strong text-white"
                  : done > 0
                    ? "bg-accent-soft border-accent/40 text-ink"
                    : "bg-surface border-border text-ink"
              } ${isCurrent ? "ring-2 ring-accent-strong ring-offset-1 ring-offset-cream" : ""}`}
            >
              <span className="font-serif text-base">{localDay}</span>
              <span
                className={`text-[9px] ${full ? "text-white/80" : "text-ink-muted"}`}
              >
                {done}/{REQUIRED_TASK_COUNT}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
