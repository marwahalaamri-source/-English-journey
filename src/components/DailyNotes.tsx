"use client";

import { useApp } from "@/context/AppContext";
import AutoSaveTextarea from "./AutoSaveTextarea";

interface DailyNotesProps {
  value: string;
  onCommit: (value: string) => void;
}

export default function DailyNotes({ value, onCommit }: DailyNotesProps) {
  const { t } = useApp();

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="font-serif text-lg text-ink mb-3">
        {t((d) => d.journal.todaysNotes)}
      </h2>
      <AutoSaveTextarea
        value={value}
        onCommit={onCommit}
        placeholder={t((d) => d.journal.notesPlaceholder)}
        rows={6}
      />
    </div>
  );
}
