import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  accent?: "blue" | "gold" | "green";
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-accent-soft text-accent-strong",
  gold: "bg-gold/15 text-gold",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function StatCard({ icon, value, label, accent = "blue" }: StatCardProps) {
  return (
    <div className="card-shadow rounded-2xl bg-surface border border-border p-4 flex flex-col gap-2 min-w-0">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentStyles[accent]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold text-ink truncate">{value}</div>
        <div className="text-xs text-ink-muted truncate">{label}</div>
      </div>
    </div>
  );
}
