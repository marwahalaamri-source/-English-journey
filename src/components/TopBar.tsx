"use client";

import { useState } from "react";
import { ChevronDown, Languages, Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { USERS } from "@/lib/users";

export default function TopBar() {
  const { language, setLanguage, theme, toggleTheme, currentUserId, selectUser, t } =
    useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = USERS.find((u) => u.id === currentUserId);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur supports-backdrop-blur:bg-cream/80">
      <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-full bg-accent-soft text-accent-strong flex items-center justify-center font-serif text-lg">
            E
          </div>
          <div className="min-w-0">
            <p className="font-serif text-[15px] leading-tight text-ink truncate">
              {t((d) => d.app.name)}
            </p>
            <p className="text-[11px] text-ink-muted truncate">
              {t((d) => d.app.tagline)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="tap-scale flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink"
          >
            {currentUser?.name}
            <ChevronDown size={14} className="text-ink-muted" />
          </button>
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            aria-label="Toggle language"
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-border text-ink"
          >
            <Languages size={15} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="tap-scale w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-border text-ink"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute top-11 end-0 z-50 w-40 rounded-2xl border border-border bg-surface card-shadow overflow-hidden">
                {USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      selectUser(user.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-start hover:bg-surface-hover ${
                      user.id === currentUserId
                        ? "text-accent-strong font-semibold"
                        : "text-ink"
                    }`}
                  >
                    <span>{user.emoji}</span>
                    {user.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
