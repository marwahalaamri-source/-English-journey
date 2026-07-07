"use client";

import { Check, ExternalLink, RotateCcw } from "lucide-react";
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
  const openResourceLabel = t((d) => d.common.openResource);
  const markDoneLabel = t((d) => d.common.markDone);
  const undoLabel = t((d) => d.common.undo);

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        completed
          ? "bg-accent-soft border-accent/40"
          : "bg-surface border-border"
      }`}
    >
      <div className="flex items-start gap-3.5">
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
          <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
            {description}
          </p>
          <p className="text-xs text-accent-strong font-medium mt-1.5">
            {task.minutes} {minLabel} · +{task.xp} XP
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {task.resourceUrl && (
          <a
            href={task.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-scale flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent-strong text-white text-xs font-semibold py-2.5"
          >
            <ExternalLink size={13} />
            {openResourceLabel}
          </a>
        )}
        <button
          onClick={() => toggleTask(task.id)}
          className={`tap-scale flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold py-2.5 px-3.5 border ${
            task.resourceUrl ? "" : "flex-1"
          } ${
            completed
              ? "bg-accent-strong border-accent-strong text-white"
              : "bg-surface border-border text-ink"
          }`}
        >
          {completed ? (
            <RotateCcw size={13} strokeWidth={2.5} />
          ) : (
            <Check size={13} strokeWidth={3} />
          )}
          {completed ? undoLabel : markDoneLabel}
        </button>
      </div>
    </div>
  );
}
