"use client";

import { AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

/** Shown only when Supabase env vars aren't reaching this build, so it's
 * obvious (without opening DevTools) that a feature is only saving to
 * this device instead of syncing across devices. Renders nothing once
 * Supabase is actually configured. */
export default function SyncStatusNotice() {
  const { t } = useApp();

  if (isSupabaseConfigured()) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-gold/40 bg-gold/10 p-3.5 mb-4">
      <AlertTriangle size={16} className="text-gold shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-ink">
          {t((d) => d.common.notSyncedTitle)}
        </p>
        <p className="text-xs text-ink-muted mt-0.5">
          {t((d) => d.common.notSyncedBody)}
        </p>
      </div>
    </div>
  );
}
