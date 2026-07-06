"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { useApp } from "@/context/AppContext";
import type { Dictionary } from "@/lib/i18n";

const TABS: { href: string; icon: IconName; label: (d: Dictionary) => string }[] = [
  { href: "/", icon: "LayoutDashboard", label: (d) => d.nav.dashboard },
  { href: "/tasks", icon: "ListChecks", label: (d) => d.nav.tasks },
  { href: "/calendar", icon: "CalendarDays", label: (d) => d.nav.calendar },
  { href: "/team", icon: "Users", label: (d) => d.nav.team },
  { href: "/achievements", icon: "Award", label: (d) => d.nav.achievements },
  { href: "/profile", icon: "User", label: (d) => d.nav.profile },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur supports-backdrop-blur:bg-surface/80 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-2xl grid grid-cols-6">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="tap-scale flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium"
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-strong"
                    : "text-ink-muted"
                }`}
              >
                <Icon name={tab.icon} size={19} />
              </span>
              <span className={active ? "text-accent-strong" : "text-ink-muted"}>
                {t(tab.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
