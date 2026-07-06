"use client";

import Link from "next/link";
import { Moon, Sun, Languages } from "lucide-react";
import { useApp, useCurrentUserMeta } from "@/context/AppContext";

export default function TopBar() {
  const { language, setLanguage, theme, toggleTheme, stats, t } = useApp();
  const userMeta = useCurrentUserMeta();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-backdrop-blur:bg-surface/80">
      <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">📘</span>
          <span className="font-bold text-ink text-sm truncate">
            {t((d) => d.app.name)}
          </span>
          {stats && (
            <span className="ms-1 shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent-soft text-accent-strong">
              {t((d) => d.dashboard.dayBadge, { day: stats.day })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            aria-label="Toggle language"
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center bg-cream-soft text-ink hover:bg-surface-hover"
          >
            <Languages size={16} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center bg-cream-soft text-ink hover:bg-surface-hover"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/profile"
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: userMeta?.color ?? "#7FC7EA" }}
          >
            {userMeta?.emoji ?? "🙂"}
          </Link>
        </div>
      </div>
    </header>
  );
}
