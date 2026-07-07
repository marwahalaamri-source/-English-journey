"use client";

import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import TaskCard from "@/components/TaskCard";
import { OPTIONAL_TASKS, REQUIRED_TASK_COUNT, REQUIRED_TASKS } from "@/lib/tasks";
import { requiredCompletedCount } from "@/lib/selectors";
import { getMonthKey } from "@/lib/months";

export default function TasksPage() {
  const { stats, t } = useApp();

  if (!stats) return null;

  const doneCount = requiredCompletedCount(stats.todayRecord);
  const allDone = doneCount >= REQUIRED_TASK_COUNT;
  const monthKey = getMonthKey(stats.day);
  const monthTitle = t((d) => d.months[monthKey].title);

  return (
    <div className="pb-4">
      <PageHeader
        title={t((d) => d.tasks.title)}
        subtitle={t((d) => d.dashboard.journeyLine, {
          dayInMonth: stats.dayInMonth,
          month: stats.monthIndex,
          title: monthTitle,
        })}
      />

      <div className="card-shadow rounded-2xl bg-surface border border-border p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-ink">
            {t((d) => d.tasks.progressLabel, {
              done: doneCount,
              total: REQUIRED_TASK_COUNT,
            })}
          </span>
          <span className="text-sm font-bold text-accent-strong">
            {stats.todayProgressPercent}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-cream-soft overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-strong transition-all duration-500"
            style={{ width: `${stats.todayProgressPercent}%` }}
          />
        </div>
        <p className="text-xs text-ink-muted mt-2">
          {allDone ? t((d) => d.tasks.allDone) : t((d) => d.tasks.keepGoing)}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mb-6">
        {REQUIRED_TASKS.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            completed={stats.todayRecord.completedTaskIds.includes(task.id)}
          />
        ))}
      </div>

      {OPTIONAL_TASKS.length > 0 && (
        <>
          <h2 className="font-semibold text-ink mb-3 text-sm">
            {t((d) => d.common.optional)}
          </h2>
          <div className="flex flex-col gap-2.5">
            {OPTIONAL_TASKS.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                completed={stats.todayRecord.completedTaskIds.includes(task.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
