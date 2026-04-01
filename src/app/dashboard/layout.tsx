"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { label: "Дашборд", href: "/dashboard" },
  { label: "Аналитика", href: "/dashboard/analytics" },
  { label: "Планировщик", href: "/dashboard/scheduler" },
  { label: "AI Помощник", href: "/dashboard/ai-writer" },
];

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
      <aside className="flex w-56 shrink-0 flex-col bg-[#111111]">
        <div className="px-5 py-6">
          <span className="text-lg font-bold text-[#e8c547]">TG Growth OS</span>
        </div>

        <nav className="flex-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#e8c547]/10 font-medium text-[#e8c547]"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 px-3 py-4">
          <Link
            href="/dashboard/settings"
            className={`mb-1 flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-[#e8c547]/10 font-medium text-[#e8c547]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Настройки
          </Link>
          <button
            onClick={handleSignOut}
            className="mt-1 w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Выйти
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
