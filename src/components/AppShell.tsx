"use client";

import type { ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import UserPicker from "./UserPicker";

export default function AppShell({ children }: { children: ReactNode }) {
  const { mounted, currentUserId } = useApp();

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-3xl animate-pulse">📘</div>
      </div>
    );
  }

  if (!currentUserId) {
    return <UserPicker />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
