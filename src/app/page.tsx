"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Flame, Sparkles, Target } from "lucide-react";
import { useApp } from "@/context/AppContext";
import StatCard from "@/components/StatCard";
import { Icon, type IconName } from "@/components/Icon";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { getMonthKey } from "@/lib/months";
import { REQUIRED_TASK_COUNT } from "@/lib/tasks";
import { requiredCompletedCount } from "@/lib/selectors";
import { getLatestMessage, subscribeToMessages, type TeamMessage } from "@/lib/teamWall";
import { getUserMetaOrFallback } from "@/lib/users";

function greetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const hour = new Date().getHours();
  if (hour < 12) return "greetingMorning";
  if (hour < 18) return "greetingAfternoon";
  return "greetingEvening";
}

function formatStudyTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function DashboardPage() {
  const { progress, stats, t } = useApp();
  const [latestMessage, setLatestMessage] = useState<TeamMessage | null | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const message = await getLatestMessage();
      if (!cancelled) setLatestMessage(message);
    }

    refresh();
    const unsubscribe = subscribeToMessages(refresh);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (!progress || !stats) return null;

  const monthKey = getMonthKey(stats.day);
  const monthTitle = t((d) => d.months[monthKey].title);
  const doneCount = requiredCompletedCount(stats.currentDayRecord);

  const unlockedIds = Object.entries(progress.unlockedAchievements).sort(
    (a, b) => (a[1] < b[1] ? 1 : -1),
  );
  const latestAchievement = unlockedIds.length
    ? ACHIEVEMENTS.find((a) => a.id === unlockedIds[0][0])
    : null;

  return (
    <div className="pb-4">
      <div className="mb-6">
        <p className="text-ink-muted text-sm">{t((d) => d.dashboard[greetingKey()])}</p>
        <h1 className="font-serif italic text-4xl text-ink leading-tight">
          {progress.displayName}
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          {t((d) => d.dashboard.journeyLine, {
            dayInMonth: stats.dayInMonth,
            month: stats.monthIndex,
            title: monthTitle,
          })}
        </p>
      </div>

      <Link
        href={`/journey/${stats.monthIndex}/${stats.day}`}
        className="tap-scale block card-shadow rounded-2xl bg-surface border border-border p-5 mb-5"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wide font-medium text-ink-muted">
            {t((d) => d.dashboard.todaysProgress)}
          </span>
          <span className="tap-scale flex items-center gap-1 rounded-full bg-accent text-accent-contrast text-xs font-semibold px-3.5 py-1.5">
            {t((d) => d.common.open)}
            <ArrowRight size={13} className="rtl:rotate-180" />
          </span>
        </div>
        <div className="flex items-baseline gap-1 font-serif text-ink">
          <span className="text-5xl">{doneCount}</span>
          <span className="text-xl text-ink-muted">/{REQUIRED_TASK_COUNT}</span>
        </div>
        <p className="text-sm text-ink-muted mt-1 mb-4">
          {t((d) => d.dashboard.tasksCompletedLabel)}
        </p>
        <div className="h-2 rounded-full bg-cream-soft overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-strong transition-all duration-500"
            style={{ width: `${stats.currentDayProgressPercent}%` }}
          />
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={<Flame size={14} />}
          value={`${stats.streak}d`}
          label={t((d) => d.dashboard.statStreak)}
        />
        <StatCard
          icon={<Sparkles size={14} />}
          value={stats.xp}
          label={t((d) => d.dashboard.statXp)}
        />
        <StatCard
          icon={<Clock size={14} />}
          value={formatStudyTime(stats.totalMinutes)}
          label={t((d) => d.dashboard.statMinutes)}
        />
        <StatCard
          icon={<Target size={14} />}
          value={`${stats.monthCompletionPercent}%`}
          label={monthTitle}
        />
      </div>

      {latestMessage !== undefined && (
        <>
          <h2 className="font-serif text-lg text-ink mb-3">
            {t((d) => d.teamWall.teamMessageCard)}
          </h2>
          <Link
            href="/team"
            className="tap-scale card-shadow rounded-2xl bg-surface border border-border p-4 flex items-center gap-3 mb-6"
          >
            {latestMessage ? (
              <>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{
                    backgroundColor: `${getUserMetaOrFallback(latestMessage.userId).color}33`,
                  }}
                >
                  {getUserMetaOrFallback(latestMessage.userId).emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    {getUserMetaOrFallback(latestMessage.userId).name}
                  </p>
                  <p dir="auto" className="text-xs text-ink-muted truncate">
                    {latestMessage.text}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-muted">
                {t((d) => d.teamWall.noMessagesYet)}
              </p>
            )}
          </Link>
        </>
      )}

      <h2 className="font-serif text-lg text-ink mb-3">
        {t((d) => d.dashboard.latestAchievement)}
      </h2>
      {latestAchievement ? (
        <Link
          href="/achievements"
          className="tap-scale card-shadow rounded-2xl bg-surface border border-accent/30 p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-strong text-white flex items-center justify-center">
            <Icon name={latestAchievement.icon as IconName} size={22} />
          </div>
          <div>
            <div className="font-semibold text-sm text-ink">
              {t(
                (d) =>
                  d.achievements.item[
                    latestAchievement.id as keyof typeof d.achievements.item
                  ].title,
              )}
            </div>
            <div className="text-xs text-ink-muted">
              {t(
                (d) =>
                  d.achievements.item[
                    latestAchievement.id as keyof typeof d.achievements.item
                  ].description,
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-2xl bg-cream-soft border border-border p-4 text-sm text-ink-muted text-center">
          {t((d) => d.dashboard.noAchievementYet)}
        </div>
      )}
    </div>
  );
}
