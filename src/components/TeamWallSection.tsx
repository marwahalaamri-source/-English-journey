"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import SyncStatusNotice from "./SyncStatusNotice";
import { getUserMeta } from "@/lib/users";
import {
  addMessage,
  loadMessages,
  reactToMessage,
  subscribeToMessages,
  type TeamMessage,
} from "@/lib/teamWall";

const REACTIONS: { key: keyof TeamMessage["reactions"]; emoji: string }[] = [
  { key: "heart", emoji: "❤️" },
  { key: "clap", emoji: "👏" },
  { key: "fire", emoji: "🔥" },
];

export default function TeamWallSection() {
  const { currentUserId, language, t } = useApp();
  const [messages, setMessages] = useState<TeamMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const next = await loadMessages();
      if (!cancelled) setMessages(next);
    }

    refresh();
    const unsubscribe = subscribeToMessages(refresh);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  async function handlePost() {
    const text = draft.trim();
    if (!text || !currentUserId || posting) return;
    setPosting(true);
    setDraft("");
    const next = await addMessage(currentUserId, text);
    setMessages(next);
    setPosting(false);
  }

  async function handleReact(id: string, key: keyof TeamMessage["reactions"]) {
    const next = await reactToMessage(id, key);
    setMessages(next);
  }

  if (messages === null) return null;

  return (
    <div>
      <SyncStatusNotice />
      <div className="rounded-2xl border border-border bg-surface p-4 mb-4">
        <textarea
          dir="auto"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t((d) => d.teamWall.placeholder)}
          rows={2}
          className="w-full rounded-xl border border-border bg-cream-soft px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent-strong resize-none mb-2.5"
        />
        <button
          onClick={handlePost}
          disabled={!draft.trim() || posting}
          className="tap-scale w-full rounded-xl bg-accent-strong text-white text-sm font-semibold py-2.5 disabled:opacity-40"
        >
          {t((d) => d.teamWall.post)}
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl bg-cream-soft border border-border p-4 text-sm text-ink-muted text-center">
          {t((d) => d.teamWall.empty)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => {
            const meta = getUserMeta(message.userId);
            const date = new Date(message.createdAt).toLocaleString(
              language === "ar" ? "ar-EG" : "en-US",
              { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
            );
            return (
              <div
                key={message.id}
                className="card-shadow rounded-2xl bg-surface border border-border p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{ backgroundColor: `${meta.color}33` }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {meta.name}
                    </p>
                    <p className="text-[11px] text-ink-muted">{date}</p>
                  </div>
                </div>
                <p dir="auto" className="text-sm text-ink whitespace-pre-wrap mb-3">
                  {message.text}
                </p>
                <div className="flex items-center gap-2">
                  {REACTIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => handleReact(message.id, r.key)}
                      className="tap-scale flex items-center gap-1 rounded-full bg-cream-soft border border-border px-2.5 py-1 text-xs text-ink"
                    >
                      <span>{r.emoji}</span>
                      {message.reactions[r.key] > 0 && (
                        <span className="text-ink-muted">
                          {message.reactions[r.key]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
