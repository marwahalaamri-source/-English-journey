"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import TaskCard from "@/components/TaskCard";
import VocabularyJournal from "@/components/VocabularyJournal";
import YesterdaysWords from "@/components/YesterdaysWords";
import DailyNotes from "@/components/DailyNotes";
import SyncStatusNotice from "@/components/SyncStatusNotice";
import { fetchDayEntry, subscribeToDayEntry } from "@/lib/dayEntries";
import { MONTHS, TOTAL_JOURNEY_DAYS, getDayInMonth, isValidMonthIndex } from "@/lib/months";
import { getDayRecord, requiredCompletedCount } from "@/lib/selectors";
import { OPTIONAL_TASKS, REQUIRED_TASK_COUNT, REQUIRED_TASKS } from "@/lib/tasks";

export default function DayDetailPage() {
  const params = useParams<{ month: string; day: string }>();
  const monthIndex = Number(params.month);
  const globalDay = Number(params.day);
  const { progress, toggleTask, updateDayJournal, applyRemoteDayJournal, t } = useApp();
  const userId = progress?.userId ?? null;

  // Guards the one-time initial fetch below from clobbering text the user
  // has already started typing before that fetch resolves. Realtime
  // updates (genuine changes from another device) are applied regardless.
  const hasEditedRef = useRef(false);

  useEffect(() => {
    hasEditedRef.current = false;
    if (!userId) return;
    let cancelled = false;

    async function syncFromRemote() {
      const [current, previous] = await Promise.all([
        fetchDayEntry(userId!, globalDay),
        fetchDayEntry(userId!, globalDay - 1),
      ]);
      if (cancelled) return;
      if (current && !hasEditedRef.current) applyRemoteDayJournal(globalDay, current);
      if (previous) applyRemoteDayJournal(globalDay - 1, previous);
    }
    syncFromRemote();

    const unsubscribe = subscribeToDayEntry(userId, globalDay, (fields) => {
      if (!cancelled) applyRemoteDayJournal(globalDay, fields);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [userId, globalDay, applyRemoteDayJournal]);

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
  const previousRecord = getDayRecord(progress.history, globalDay - 1);
  const doneCount = requiredCompletedCount(record);

  function markEdited<T>(fn: (value: T) => void) {
    return (value: T) => {
      hasEditedRef.current = true;
      fn(value);
    };
  }

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
          <div key={task.id} className="flex flex-col gap-2.5">
            <TaskCard
              task={task}
              completed={record.completedTaskIds.includes(task.id)}
              onToggle={() => toggleTask(globalDay, task.id)}
            />
            {task.id === "vocabulary" && (
              <VocabularyJournal
                words={record.vocabWords}
                example={record.vocabExample}
                onChangeWords={markEdited((value: string) =>
                  updateDayJournal(globalDay, { vocabWords: value }),
                )}
                onChangeExample={markEdited((value: string) =>
                  updateDayJournal(globalDay, { vocabExample: value }),
                )}
              />
            )}
            {task.id === "vocabularyReview" && (
              <YesterdaysWords
                words={previousRecord.vocabWords}
                example={previousRecord.vocabExample}
              />
            )}
          </div>
        ))}
      </div>

      {OPTIONAL_TASKS.length > 0 && (
        <>
          <h2 className="font-semibold text-ink mb-3 text-sm">
            {t((d) => d.common.optional)}
          </h2>
          <div className="flex flex-col gap-2.5 mb-6">
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

      <SyncStatusNotice />
      <DailyNotes
        value={record.notes}
        onCommit={markEdited((value: string) =>
          updateDayJournal(globalDay, { notes: value }),
        )}
      />
    </div>
  );
}
