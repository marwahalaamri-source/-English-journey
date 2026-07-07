"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { MONTHS } from "@/lib/months";
import { monthCompletionPercent } from "@/lib/selectors";

export default function JourneyPage() {
  const { progress, t } = useApp();

  if (!progress) return null;

  return (
    <div className="pb-4">
      <p className="text-[11px] uppercase tracking-wide font-medium text-ink-muted mb-1.5">
        {t((d) => d.journey.eyebrow)}
      </p>
      <h1 className="font-serif text-3xl text-ink mb-2">
        {t((d) => d.journey.title)}
      </h1>
      <p className="text-sm text-ink-muted mb-6 leading-relaxed">
        {t((d) => d.journey.description)}
      </p>

      <div className="flex flex-col gap-3.5">
        {MONTHS.map((month) => {
          const percent = monthCompletionPercent(progress.history, month.index);
          const title = t((d) => d.months[month.key].title);
          const tagline = t((d) => d.months[month.key].tagline);
          return (
            <Link
              key={month.index}
              href={`/journey/${month.index}`}
              className="tap-scale card-shadow rounded-2xl bg-surface border border-border p-5"
            >
              <p className="text-[11px] uppercase tracking-wide font-medium text-ink-muted mb-1.5">
                {t((d) => d.common.month)} {month.index}
              </p>
              <h2 className="font-serif italic text-2xl text-ink mb-1">{title}</h2>
              <p className="text-sm text-ink-muted mb-4">{tagline}</p>
              <div className="flex items-center justify-between text-xs text-ink-muted mb-1.5">
                <span>{t((d) => d.journey.progress)}</span>
                <span className="font-semibold text-accent-strong">
                  {percent}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-cream-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-strong transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
