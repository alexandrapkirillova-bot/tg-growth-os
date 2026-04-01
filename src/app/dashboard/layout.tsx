"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  {
    label: "Дашборд",
    mobileLabel: "Дашборд",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Аналитика",
    mobileLabel: "Аналитика",
    href: "/dashboard/analytics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M3 15 L7 9 L11 12 L15 5 L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17 H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Планировщик",
    mobileLabel: "План",
    href: "/dashboard/scheduler",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 2 V6 M13 2 V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 8 H17" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="12" r="1" fill="currentColor" />
        <circle cx="10" cy="12" r="1" fill="currentColor" />
        <circle cx="13" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "AI Помощник",
    mobileLabel: "AI",
    href: "/dashboard/ai-writer",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M10 2 L11.5 7.5 L17 9 L11.5 10.5 L10 16 L8.5 10.5 L3 9 L8.5 7.5 Z" fill="currentColor" />
        <path d="M16 13.5 L16.6 15.4 L18.5 16 L16.6 16.6 L16 18.5 L15.4 16.6 L13.5 16 L15.4 15.4 Z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
  },
];

const SETTINGS_ITEM = {
  label: "Настройки",
  mobileLabel: "Настройки",
  href: "/dashboard/settings",
  icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.34 4.34l1.42 1.42M14.24 14.24l1.42 1.42M4.34 15.66l1.42-1.42M14.24 5.76l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const SIGN_OUT_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BOTTOM_NAV_ITEMS = [...NAV_ITEMS, SETTINGS_ITEM];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#e8c547]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar: hidden on mobile, icon-only on tablet, full on desktop */}
      <aside className="hidden md:flex md:w-[60px] lg:w-56 shrink-0 flex-col bg-[#111111]">
        <div className="px-3 py-6 lg:px-5">
          <span className="hidden lg:block text-lg font-bold text-[#e8c547]">TG Growth OS</span>
          <span className="flex justify-center lg:hidden text-lg font-bold text-[#e8c547]">TG</span>
        </div>

        <nav className="flex-1 px-1.5 lg:px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group relative mb-1 flex items-center rounded-lg px-2.5 py-2.5 text-sm transition-colors lg:px-3 ${
                  active
                    ? "bg-[#e8c547]/10 font-medium text-[#e8c547]"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="ml-3 hidden lg:block">{item.label}</span>
                {/* Tooltip — tablet only */}
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 lg:hidden">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 px-1.5 py-4 lg:px-3">
          <Link
            href="/dashboard/settings"
            title="Настройки"
            className={`group relative mb-1 flex items-center rounded-lg px-2.5 py-2.5 text-sm transition-colors lg:px-3 ${
              pathname === "/dashboard/settings"
                ? "bg-[#e8c547]/10 font-medium text-[#e8c547]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {SETTINGS_ITEM.icon}
            <span className="ml-3 hidden lg:block">Настройки</span>
            <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 lg:hidden">
              Настройки
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            title="Выйти"
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
          >
            {SIGN_OUT_ICON}
            <span className="hidden lg:block">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Page content — pb-20 on mobile reserves space for bottom nav */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">{children}</div>

      {/* Bottom navigation — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#222] bg-[#111111] md:hidden">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] leading-tight transition-colors ${
                active ? "text-[#e8c547]" : "text-[#666]"
              }`}
            >
              {item.icon}
              <span>{item.mobileLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
