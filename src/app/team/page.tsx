"use client";

import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import SyncStatusNotice from "@/components/SyncStatusNotice";
import TeamWallSection from "@/components/TeamWallSection";
import { todayStr } from "@/lib/date";
import {
  fetchAllRemoteProgress,
  subscribeToAllProgress,
  type RemoteProgressFields,
} from "@/lib/progressSync";
import { completedRequiredTasksToday, deriveStats } from "@/lib/selectors";
import { loadAllProgress } from "@/lib/storage";
import { getUserMeta } from "@/lib/users";
import type { UserProgress } from "@/lib/types";

type TeamTab = "progress" | "wall";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function TeamPage() {
  const { currentUserId, t } = useApp();
  const [allProgress, setAllProgress] = useState<UserProgress[] | null>(null);
  const [remoteProgress, setRemoteProgress] = useState<Record<
    string,
    RemoteProgressFields
  > | null>(null);
  const [tab, setTab] = useState<TeamTab>("progress");

  // Read localStorage on mount only; server has no access to it. This is
  // the only source for the original single-shared-device setup (all 4
  // profiles on one browser) and stays the fallback when Supabase isn't
  // configured.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllProgress(Object.values(loadAllProgress()));
  }, []);

  // Cross-device sync: pull every teammate's latest task completions/XP
  // from Supabase, and keep listening for live updates so a teammate
  // completing a task on their own phone shows up here without a refresh.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const remote = await fetchAllRemoteProgress();
      if (!cancelled && remote) setRemoteProgress(remote);
    }
    load();

    const unsubscribe = subscribeToAllProgress(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (!allProgress) return null;

  const today = todayStr();
  // Every row — including the signed-in user's own — reads from the exact
  // same source: Supabase once it has answered, falling back to this
  // device's localStorage snapshot until then (or permanently, if Supabase
  // isn't configured). Deliberately NOT special-casing "my" row to the
  // live AppContext copy here: that was the bug — it let this device's own
  // possibly-stale local state disagree with what every other device reads
  // for the same person from Supabase.
  const merged = allProgress.map((local) => {
    const remote = remoteProgress?.[local.userId];
    if (!remote) return local;
    return { ...local, history: remote.history, unlockedAchievements: remote.unlockedAchievements };
  });
  const ranked = merged
    .map((p) => ({ progress: p, stats: deriveStats(p, today) }))
    .sort((a, b) => b.stats.xp - a.stats.xp);
  const everyoneDoneToday =
    ranked.length > 0 &&
    ranked.every(({ progress }) => completedRequiredTasksToday(progress.history, today));

  return (
    <div className="pb-4">
      <PageHeader
        title={t((d) => d.team.title)}
        subtitle={t((d) => d.team.subtitle)}
      />

      <div className="grid grid-cols-2 gap-2 mb-5 rounded-full bg-cream-soft border border-border p-1">
        <button
          onClick={() => setTab("progress")}
          className={`tap-scale rounded-full py-2 text-sm font-semibold ${
            tab === "progress" ? "bg-surface card-shadow text-ink" : "text-ink-muted"
          }`}
        >
          {t((d) => d.teamWall.tabProgress)}
        </button>
        <button
          onClick={() => setTab("wall")}
          className={`tap-scale rounded-full py-2 text-sm font-semibold ${
            tab === "wall" ? "bg-surface card-shadow text-ink" : "text-ink-muted"
          }`}
        >
          {t((d) => d.teamWall.tabWall)}
        </button>
      </div>

      {tab === "wall" ? (
        <TeamWallSection />
      ) : (
      <div className="flex flex-col gap-3">
        <SyncStatusNotice />
        {everyoneDoneToday && (
          <div className="rounded-2xl border border-gold bg-gradient-to-br from-accent-soft to-cream-soft p-5 text-center card-shadow">
            <p className="font-serif text-lg text-ink mb-1">
              {t((d) => d.team.celebrationTitle)}
            </p>
            <p className="text-sm text-ink-muted">
              {t((d) => d.team.celebrationSubtitle)}
            </p>
          </div>
        )}
        {ranked.map(({ progress, stats }, index) => {
          const meta = getUserMeta(progress.userId);
          const isYou = progress.userId === currentUserId;
          return (
            <div
              key={progress.userId}
              className={`card-shadow rounded-2xl bg-surface border p-4 flex items-center gap-4 ${
                isYou ? "border-accent-strong" : "border-border"
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${meta.color}33` }}
                >
                  {meta.emoji}
                </div>
                <span
                  className={`absolute -top-1.5 -start-1.5 w-5 h-5 rounded-full bg-cream-soft border border-border flex items-center justify-center ${
                    MEDALS[index] ? "text-xs" : "text-[10px] font-bold text-ink-muted"
                  }`}
                >
                  {MEDALS[index] ?? index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-ink truncate">
                    {progress.displayName}
                  </span>
                  {isYou && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-soft text-accent-strong font-medium shrink-0">
                      {t((d) => d.team.you)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} className="text-gold" /> {stats.xp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame size={12} className="text-accent-strong" />{" "}
                    {stats.streak}
                  </span>
                  <span>{t((d) => d.common.day)} {stats.day}</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-1">
                <ProgressRing
                  percent={stats.currentDayProgressPercent}
                  size={52}
                  strokeWidth={5}
                  label={`${stats.currentDayProgressPercent}%`}
                />
                <span className="text-[10px] text-ink-muted">
                  {t((d) => d.team.progressToday)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
