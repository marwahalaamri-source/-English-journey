"use client";

import Link from "next/link";
import { Clock, Flame, TrendingUp, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";
import TaskCard from "@/components/TaskCard";
import { TASKS } from "@/lib/tasks";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { Icon, type IconName } from "@/components/Icon";

export default function DashboardPage() {
  const { progress, stats, t } = useApp();

  if (!progress || !stats) return null;

  const unlockedIds = Object.entries(progress.unlockedAchievements).sort(
    (a, b) => (a[1] < b[1] ? 1 : -1),
  );
  const latestAchievement = unlockedIds.length
    ? ACHIEVEMENTS.find((a) => a.id === unlockedIds[0][0])
    : null;

  return (
    <div className="pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">
          {t((d) => d.dashboard.greeting, { name: progress.displayName })}
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          {t((d) => d.dashboard.subtitle)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          icon={<Zap size={18} />}
          value={stats.xp}
          label={t((d) => d.dashboard.statXp)}
          accent="gold"
        />
        <StatCard
          icon={<Flame size={18} />}
          value={stats.streak}
          label={t((d) => d.dashboard.statStreak)}
          accent="blue"
        />
        <StatCard
          icon={<Clock size={18} />}
          value={stats.totalMinutes}
          label={t((d) => d.dashboard.statMinutes)}
          accent="green"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          value={`${stats.todayProgressPercent}%`}
          label={t((d) => d.dashboard.statProgress)}
          accent="blue"
        />
      </div>

      <div className="card-shadow rounded-2xl bg-surface border border-border p-5 flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-ink mb-1">
            {t((d) => d.dashboard.statProgress)}
          </p>
          <p className="text-xs text-ink-muted max-w-[140px]">
            {t((d) => d.dashboard.quote)}
          </p>
        </div>
        <ProgressRing
          percent={stats.todayProgressPercent}
          size={92}
          strokeWidth={8}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-ink">
          {t((d) => d.dashboard.todayTasks)}
        </h2>
        <Link href="/tasks" className="text-xs font-semibold text-accent-strong">
          {t((d) => d.dashboard.viewAll)}
        </Link>
      </div>
      <div className="flex flex-col gap-2.5 mb-6">
        {TASKS.slice(0, 4).map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            completed={stats.todayRecord.completedTaskIds.includes(task.id)}
          />
        ))}
      </div>

      <h2 className="font-semibold text-ink mb-3">
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
