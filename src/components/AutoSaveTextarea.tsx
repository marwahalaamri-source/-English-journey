"use client";

import { useEffect, useRef, useState } from "react";

interface AutoSaveTextareaProps {
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const DEBOUNCE_MS = 500;

export default function AutoSaveTextarea({
  value: rawValue,
  onCommit,
  placeholder,
  rows = 3,
  className = "",
}: AutoSaveTextareaProps) {
  // Defensive: tolerate a non-string value (e.g. null from a malformed
  // Supabase row) instead of handing React an invalid controlled-input value.
  const value = rawValue ?? "";
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resync local state when the committed value changes for a reason other
  // than our own typing (e.g. switching users on the same page).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocal(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setLocal(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onCommit(next), DEBOUNCE_MS);
  }

  function handleBlur() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onCommit(local);
  }

  return (
    <textarea
      dir="auto"
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      rows={rows}
      className={`w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent-strong resize-none ${className}`}
    />
  );
}
