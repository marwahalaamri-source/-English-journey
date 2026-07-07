"use client";

import { useState } from "react";
import { Clock, Flame, LogOut, Moon, Sun, Zap } from "lucide-react";
import { useApp, useCurrentUserMeta } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";

export default function ProfilePage() {
  const {
    progress,
    stats,
    language,
    setLanguage,
    theme,
    setTheme,
    switchToPicker,
    updateDisplayName,
    resetMyProgress,
    t,
  } = useApp();
  const meta = useCurrentUserMeta();
  const [name, setName] = useState(progress?.displayName ?? "");
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!progress || !stats || !meta) return null;

  const memberSince = new Date(progress.startDate).toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="pb-4">
      <PageHeader title={t((d) => d.profile.title)} />

      <div className="card-shadow rounded-2xl bg-surface border border-border p-5 flex flex-col items-center text-center mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3"
          style={{ backgroundColor: `${meta.color}33` }}
        >
          {meta.emoji}
        </div>
        <div className="font-serif text-xl text-ink">{progress.displayName}</div>
        <p className="text-xs text-ink-muted mt-1">
          {t((d) => d.profile.memberSince, { date: memberSince })}
        </p>
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
          {t((d) => d.profile.displayName)}
        </label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent-strong"
          />
          <button
            onClick={() => name.trim() && updateDisplayName(name.trim())}
            className="tap-scale px-4 rounded-xl bg-accent-strong text-white text-sm font-semibold"
          >
            {t((d) => d.common.save)}
          </button>
        </div>
      </div>

      <h2 className="text-xs font-semibold text-ink-muted mb-2">
        {t((d) => d.profile.yourStats)}
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card-shadow rounded-2xl bg-surface border border-border p-3 flex flex-col items-center gap-1">
          <Zap size={16} className="text-gold" />
          <span className="font-bold text-ink text-sm">{stats.xp}</span>
          <span className="text-[10px] text-ink-muted">
            {t((d) => d.common.xp)}
          </span>
        </div>
        <div className="card-shadow rounded-2xl bg-surface border border-border p-3 flex flex-col items-center gap-1">
          <Flame size={16} className="text-accent-strong" />
          <span className="font-bold text-ink text-sm">{stats.streak}</span>
          <span className="text-[10px] text-ink-muted">
            {t((d) => d.common.streak)}
          </span>
        </div>
        <div className="card-shadow rounded-2xl bg-surface border border-border p-3 flex flex-col items-center gap-1">
          <Clock size={16} className="text-emerald-600" />
          <span className="font-bold text-ink text-sm">
            {stats.totalMinutes}
          </span>
          <span className="text-[10px] text-ink-muted">
            {t((d) => d.common.minutes)}
          </span>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-xs font-semibold text-ink-muted mb-2">
          {t((d) => d.profile.language)}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`tap-scale rounded-xl border py-2.5 text-sm font-semibold ${
              language === "en"
                ? "bg-accent-strong text-white border-accent-strong"
                : "bg-surface text-ink border-border"
            }`}
          >
            {t((d) => d.profile.english)}
          </button>
          <button
            onClick={() => setLanguage("ar")}
            className={`tap-scale rounded-xl border py-2.5 text-sm font-semibold ${
              language === "ar"
                ? "bg-accent-strong text-white border-accent-strong"
                : "bg-surface text-ink border-border"
            }`}
          >
            {t((d) => d.profile.arabic)}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-semibold text-ink-muted mb-2">
          {t((d) => d.profile.theme)}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`tap-scale rounded-xl border py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 ${
              theme === "light"
                ? "bg-accent-strong text-white border-accent-strong"
                : "bg-surface text-ink border-border"
            }`}
          >
            <Sun size={14} /> {t((d) => d.profile.light)}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`tap-scale rounded-xl border py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 ${
              theme === "dark"
                ? "bg-accent-strong text-white border-accent-strong"
                : "bg-surface text-ink border-border"
            }`}
          >
            <Moon size={14} /> {t((d) => d.profile.dark)}
          </button>
        </div>
      </div>

      <button
        onClick={switchToPicker}
        className="tap-scale w-full rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-ink flex items-center justify-center gap-2 mb-6"
      >
        <LogOut size={15} /> {t((d) => d.profile.switchUser)}
      </button>

      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4">
        <h2 className="text-sm font-semibold text-danger mb-1">
          {t((d) => d.profile.dangerZone)}
        </h2>
        <p className="text-xs text-ink-muted mb-3">
          {t((d) => d.profile.resetDescription)}
        </p>
        <button
          onClick={() => setConfirmingReset(true)}
          className="tap-scale w-full rounded-xl bg-danger text-white py-2.5 text-sm font-semibold"
        >
          {t((d) => d.profile.resetProgress)}
        </button>
      </div>

      {confirmingReset && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface border border-border p-5 card-shadow">
            <h3 className="font-bold text-ink mb-2">
              {t((d) => d.profile.resetConfirmTitle)}
            </h3>
            <p className="text-sm text-ink-muted mb-4">
              {t((d) => d.profile.resetConfirmBody)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingReset(false)}
                className="tap-scale flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-ink"
              >
                {t((d) => d.common.cancel)}
              </button>
              <button
                onClick={() => {
                  resetMyProgress();
                  setConfirmingReset(false);
                }}
                className="tap-scale flex-1 rounded-xl bg-danger text-white py-2.5 text-sm font-semibold"
              >
                {t((d) => d.profile.confirmReset)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
