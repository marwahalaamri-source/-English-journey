"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";

interface AutoSaveTextareaProps {
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const DEBOUNCE_MS = 500;
const SAVED_INDICATOR_MS = 1500;

type SaveState = "idle" | "pending" | "saved";

export default function AutoSaveTextarea({
  value: rawValue,
  onCommit,
  placeholder,
  rows = 3,
  className = "",
}: AutoSaveTextareaProps) {
  const { t } = useApp();
  // Defensive: tolerate a non-string value (e.g. null from a malformed
  // Supabase row) instead of handing React an invalid controlled-input value.
  const value = rawValue ?? "";
  const [local, setLocal] = useState(value);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether this textarea currently has focus. While focused, an
  // external `value` update (e.g. a remote Supabase row echoed back over
  // realtime after our own write, or the initial fetch-on-mount resolving
  // mid-keystroke) must never overwrite `local` — otherwise it stomps on
  // whatever the user is actively typing, which is exactly what caused text
  // to reset/disappear while typing.
  const isFocusedRef = useRef(false);

  // Resync local state when the committed value changes for a reason other
  // than our own typing (e.g. switching users on the same page, or a remote
  // sync arriving). Skipped while focused — see isFocusedRef above.
  useEffect(() => {
    if (isFocusedRef.current) return;
    setLocal(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current);
    };
  }, []);

  function commit(next: string) {
    onCommit(next);
    setSaveState("saved");
    if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current);
    savedIndicatorTimerRef.current = setTimeout(() => setSaveState("idle"), SAVED_INDICATOR_MS);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setLocal(next);
    setSaveState("pending");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(next), DEBOUNCE_MS);
  }

  function handleFocus() {
    isFocusedRef.current = true;
  }

  function handleBlur() {
    isFocusedRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    commit(local);
  }

  return (
    <div>
      <textarea
        dir="auto"
        value={local}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent-strong resize-none ${className}`}
      />
      <p className="h-4 mt-1 text-[11px] text-ink-muted">
        {saveState === "pending" && t((d) => d.journal.saving)}
        {saveState === "saved" && t((d) => d.journal.saved)}
      </p>
    </div>
  );
}
