"use client";

import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import { todayStr } from "@/lib/date";
import { deriveStats } from "@/lib/selectors";
import { loadAllProgress } from "@/lib/storage";
import { getUserMeta } from "@/lib/users";
import type { UserProgress } from "@/lib/types";

export default function TeamPage() {
  const { currentUserId, t } = useApp();
  const [allProgress, setAllProgress] = useState<UserProgress[] | null>(null);

  // Read localStorage on mount only; server has no access to it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllProgress(Object.values(loadAllProgress()));
  }, []);

  if (!allProgress) return null;

  const today = todayStr();
  const ranked = allProgress
    .map((p) => ({ progress: p, stats: deriveStats(p, today) }))
    .sort((a, b) => b.stats.xp - a.stats.xp);

  return (
    <div className="pb-4">
      <PageHeader
        title={t((d) => d.team.title)}
        subtitle={t((d) => d.team.subtitle)}
      />

      <div className="flex flex-col gap-3">
        {ranked.map(({ progress, stats }, index) => {
          const meta = getUserMeta(progress.userId);
          const isYou = progress.userId === currentUserId;
          return (
            <div
              key={progress.userId}
              className={`card-shadow rounded-2xl bg-surface border p-4 flex items-center gap-4 ${
                isYou ? "border-accent-strong" : "border-border"
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${meta.color}33` }}
                >
                  {meta.emoji}
                </div>
                <span className="absolute -top-1.5 -start-1.5 w-5 h-5 rounded-full bg-cream-soft border border-border text-[10px] font-bold text-ink-muted flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-ink truncate">
                    {progress.displayName}
                  </span>
                  {isYou && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-soft text-accent-strong font-medium shrink-0">
                      {t((d) => d.team.you)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Zap size={12} className="text-gold" /> {stats.xp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame size={12} className="text-accent-strong" />{" "}
                    {stats.streak}
                  </span>
                  <span>{t((d) => d.common.day)} {stats.day}</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-1">
                <ProgressRing
                  percent={stats.todayProgressPercent}
                  size={52}
                  strokeWidth={5}
                  label={`${stats.todayProgressPercent}%`}
                />
                <span className="text-[10px] text-ink-muted">
                  {t((d) => d.team.progressToday)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
