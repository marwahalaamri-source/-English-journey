"use client";

import { Check } from "lucide-react";
import { Icon, type IconName } from "./Icon";
import { useApp } from "@/context/AppContext";
import type { TaskDefinition } from "@/lib/types";

interface TaskCardProps {
  task: TaskDefinition;
  completed: boolean;
}

export default function TaskCard({ task, completed }: TaskCardProps) {
  const { toggleTask, t } = useApp();
  const title = t((d) => d.tasks.task[task.id].title);
  const description = t((d) => d.tasks.task[task.id].description);
  const optionalLabel = t((d) => d.tasks.optionalBadge);
  const minLabel = t((d) => d.common.min);

  return (
    <button
      onClick={() => toggleTask(task.id)}
      className={`tap-scale w-full text-start rounded-2xl border p-4 flex items-center gap-4 transition-colors ${
        completed
          ? "bg-accent-soft border-accent/40"
          : "bg-surface border-border hover:bg-surface-hover"
      }`}
    >
      <div
        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
          completed ? "bg-accent-strong text-white" : "bg-cream-soft text-accent-strong"
        }`}
      >
        <Icon name={task.icon as IconName} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink truncate">{title}</span>
          {task.optional && (
            <span className="shrink-0 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-gold/15 text-gold font-medium">
              {optionalLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-ink-muted truncate mt-0.5">{description}</p>
        <p className="text-xs text-accent-strong font-medium mt-1">
          {task.minutes} {minLabel} · +{task.xp} XP
        </p>
      </div>
      <div
        className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          completed
            ? "bg-accent-strong border-accent-strong text-white"
            : "border-border text-transparent"
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </div>
    </button>
  );
}
