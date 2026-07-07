"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import TaskCard from "@/components/TaskCard";
import { MONTHS, TOTAL_JOURNEY_DAYS, getDayInMonth, isValidMonthIndex } from "@/lib/months";
import { getDayRecord, requiredCompletedCount } from "@/lib/selectors";
import { OPTIONAL_TASKS, REQUIRED_TASK_COUNT, REQUIRED_TASKS } from "@/lib/tasks";

export default function DayDetailPage() {
  const params = useParams<{ month: string; day: string }>();
  const monthIndex = Number(params.month);
  const globalDay = Number(params.day);
  const { progress, toggleTask, t } = useApp();

  if (
    !isValidMonthIndex(monthIndex) ||
    !Number.isInteger(globalDay) ||
    globalDay < 1 ||
    globalDay > TOTAL_JOURNEY_DAYS
  ) {
    notFound();
  }
  if (!progress) return null;

  const monthMeta = MONTHS[monthIndex - 1];
  const monthTitle = t((d) => d.months[monthMeta.key].title);
  const localDay = getDayInMonth(globalDay);
  const record = getDayRecord(progress.history, globalDay);
  const doneCount = requiredCompletedCount(record);

  return (
    <div className="pb-4">
      <Link
        href={`/journey/${monthIndex}`}
        className="inline-flex items-center gap-1 text-sm text-ink-muted mb-4"
      >
        <ChevronLeft size={15} className="rtl:rotate-180" />
        {t((d) => d.journey.backToMonth, { title: monthTitle })}
      </Link>

      <p className="text-[11px] uppercase tracking-wide font-medium text-ink-muted mb-1.5">
        {t((d) => d.journey.monthEyebrow, { month: monthIndex, title: monthTitle })}
      </p>
      <h1 className="font-serif text-3xl text-ink mb-1">
        {t((d) => d.journey.dayHeading, { day: localDay })}
      </h1>
      <p className="text-sm text-ink-muted mb-6">
        {t((d) => d.journey.taskCountLabel, {
          done: doneCount,
          total: REQUIRED_TASK_COUNT,
        })}{" "}
        · {t((d) => d.journey.anyOrder)}
      </p>

      <div className="flex flex-col gap-2.5 mb-6">
        {REQUIRED_TASKS.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            completed={record.completedTaskIds.includes(task.id)}
            onToggle={() => toggleTask(globalDay, task.id)}
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
                completed={record.completedTaskIds.includes(task.id)}
                onToggle={() => toggleTask(globalDay, task.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
