import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-4 flex flex-col gap-2.5 min-w-0">
      <div className="flex items-center gap-1.5 text-ink-muted">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-medium truncate">
          {label}
        </span>
      </div>
      <div className="font-serif text-2xl text-ink truncate">{value}</div>
    </div>
  );
}
