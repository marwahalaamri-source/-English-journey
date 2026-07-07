"use client";

import { useApp } from "@/context/AppContext";

interface YesterdaysWordsProps {
  words: string;
  example: string;
}

export default function YesterdaysWords({ words, example }: YesterdaysWordsProps) {
  const { t } = useApp();
  const hasContent = words.trim().length > 0 || example.trim().length > 0;

  return (
    <div className="rounded-2xl border border-border bg-cream-soft p-4 -mt-1 mb-2.5">
      <p className="text-xs font-semibold text-ink-muted mb-1.5">
        {t((d) => d.journal.yesterdaysWords)}
      </p>
      {hasContent ? (
        <div className="space-y-2">
          {words.trim() && (
            <p dir="auto" className="text-sm text-ink whitespace-pre-wrap">
              {words}
            </p>
          )}
          {example.trim() && (
            <p dir="auto" className="text-sm text-ink-muted italic whitespace-pre-wrap">
              {example}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink-muted">{t((d) => d.journal.noYesterdayWords)}</p>
      )}
    </div>
  );
}
