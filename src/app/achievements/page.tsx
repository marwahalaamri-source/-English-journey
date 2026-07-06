"use client";

import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import AchievementBadge from "@/components/AchievementBadge";
import { ACHIEVEMENTS } from "@/lib/achievements";

export default function AchievementsPage() {
  const { progress, t } = useApp();

  if (!progress) return null;

  return (
    <div className="pb-4">
      <PageHeader
        title={t((d) => d.achievements.title)}
        subtitle={t((d) => d.achievements.subtitle)}
      />

      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            unlockedDate={progress.unlockedAchievements[achievement.id] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
