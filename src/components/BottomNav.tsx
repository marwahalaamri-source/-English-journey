"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { useApp } from "@/context/AppContext";
import type { Dictionary } from "@/lib/i18n";

const TABS: { href: string; icon: IconName; label: (d: Dictionary) => string }[] = [
  { href: "/", icon: "Home", label: (d) => d.nav.home },
  { href: "/team", icon: "Users", label: (d) => d.nav.team },
  { href: "/journey", icon: "CalendarDays", label: (d) => d.nav.journey },
  { href: "/achievements", icon: "Award", label: (d) => d.nav.achievements },
  { href: "/profile", icon: "User", label: (d) => d.nav.profile },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto card-shadow flex items-center gap-0.5 rounded-full border border-border bg-surface/95 backdrop-blur px-2 py-2">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="tap-scale flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 text-[10px] font-medium rounded-full"
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  active ? "bg-accent-soft text-accent-strong" : "text-ink-muted"
                }`}
              >
                <Icon name={tab.icon} size={18} />
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
