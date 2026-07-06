"use client";

import { useApp } from "@/context/AppContext";
import { USERS } from "@/lib/users";

export default function UserPicker() {
  const { selectUser, t, language, setLanguage } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-cream to-cream-soft">
      <button
        onClick={() => setLanguage(language === "en" ? "ar" : "en")}
        className="absolute top-5 end-5 text-xs font-semibold px-3 py-1.5 rounded-full bg-surface border border-border text-ink"
      >
        {language === "en" ? "العربية" : "English"}
      </button>

      <div className="text-4xl mb-3">📘</div>
      <h1 className="text-2xl font-bold text-ink mb-1 text-center">
        {t((d) => d.app.name)}
      </h1>
      <p className="text-ink-muted text-sm mb-8 text-center">
        {t((d) => d.onboarding.subtitle)}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {USERS.map((user) => (
          <button
            key={user.id}
            onClick={() => selectUser(user.id)}
            className="tap-scale card-shadow rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-3 hover:bg-surface-hover"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${user.color}33` }}
            >
              {user.emoji}
            </div>
            <span className="font-semibold text-ink">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
