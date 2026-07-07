"use client";

import { useApp } from "@/context/AppContext";
import AutoSaveTextarea from "./AutoSaveTextarea";

interface VocabularyJournalProps {
  words: string;
  example: string;
  onChangeWords: (value: string) => void;
  onChangeExample: (value: string) => void;
}

export default function VocabularyJournal({
  words,
  example,
  onChangeWords,
  onChangeExample,
}: VocabularyJournalProps) {
  const { t } = useApp();

  return (
    <div className="rounded-2xl border border-border bg-cream-soft p-4 -mt-1 mb-2.5">
      <label className="block text-xs font-semibold text-ink-muted mb-1.5">
        {t((d) => d.journal.wordsToday)}
      </label>
      <AutoSaveTextarea
        value={words}
        onCommit={onChangeWords}
        placeholder={t((d) => d.journal.wordsPlaceholder)}
        rows={3}
        className="mb-3"
      />
      <label className="block text-xs font-semibold text-ink-muted mb-1.5">
        {t((d) => d.journal.exampleSentence)}
      </label>
      <AutoSaveTextarea
        value={example}
        onCommit={onChangeExample}
        placeholder={t((d) => d.journal.examplePlaceholder)}
        rows={2}
      />
    </div>
  );
}
