"use client";

import { Icon, type IconName } from "./Icon";
import { useApp } from "@/context/AppContext";
import type { AchievementDefinition } from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  unlockedDate: string | null;
}

export default function AchievementBadge({
  achievement,
  unlockedDate,
}: AchievementBadgeProps) {
  const { t } = useApp();
  const title = t((d) => d.achievements.item[achievement.id as keyof typeof d.achievements.item].title);
  const description = t(
    (d) => d.achievements.item[achievement.id as keyof typeof d.achievements.item].description,
  );
  const unlocked = Boolean(unlockedDate);

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 card-shadow ${
        unlocked
          ? "bg-surface border-accent/30"
          : "bg-cream-soft border-border opacity-60"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          unlocked
            ? "bg-gradient-to-br from-accent to-accent-strong text-white"
            : "bg-surface text-ink-muted"
        }`}
      >
        <Icon name={achievement.icon as IconName} size={26} />
      </div>
      <div className="font-serif text-base text-ink">{title}</div>
      <p className="text-xs text-ink-muted leading-snug">{description}</p>
      {unlocked ? (
        <span className="text-[10px] font-medium text-accent-strong mt-1">
          {t((d) => d.achievements.unlockedOn, { date: unlockedDate ?? "" })}
        </span>
      ) : (
        <span className="text-[10px] font-medium text-ink-muted mt-1">
          {t((d) => d.achievements.stillLocked)}
        </span>
      )}
    </div>
  );
}
