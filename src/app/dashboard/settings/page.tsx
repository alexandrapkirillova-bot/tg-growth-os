"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PLANS = [
  {
    key: "free",
    label: "Бесплатный",
    price: null,
    features: ["1 канал", "Аналитика 7 дней"],
  },
  {
    key: "standard",
    label: "Стандарт",
    price: "₽1500/мес",
    features: ["3 канала", "Аналитика 30 дней"],
  },
  {
    key: "pro",
    label: "Про",
    price: "₽4500/мес",
    features: ["10 каналов", "Всё включено"],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("free");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("users")
        .select("name, plan")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.name ?? "");
        setPlan(data.plan ?? "free");
      }
    }

    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("users")
      .upsert({ id: user.id, name })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Вы уверены? Это действие нельзя отменить"
    );
    if (confirmed) {
      // Реализация удаления аккаунта
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white">Настройки</h1>

      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Профиль */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Профиль</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-500 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#e8c547] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </button>
              {saved && (
                <span className="text-sm text-[#e8c547]">Изменения сохранены!</span>
              )}
            </div>
          </form>
        </section>

        {/* Тариф */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Ваш тариф</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => {
              const active = plan === p.key;
              return (
                <div
                  key={p.key}
                  className={`rounded-lg border p-4 transition-colors ${
                    active
                      ? "border-[#e8c547] bg-[#e8c547]/5"
                      : "border-zinc-700 bg-zinc-800/50"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-white">{p.label}</span>
                    {active && (
                      <span className="rounded-full bg-[#e8c547]/20 px-2 py-0.5 text-xs text-[#e8c547]">
                        Текущий
                      </span>
                    )}
                  </div>
                  {p.price && (
                    <p className="mb-3 text-sm text-zinc-400">{p.price}</p>
                  )}
                  <ul className="mb-4 space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs text-zinc-500">
                        • {f}
                      </li>
                    ))}
                  </ul>
                  {p.key !== "free" && !active && (
                    <button
                      disabled
                      className="w-full rounded-lg border border-zinc-600 py-1.5 text-xs text-zinc-500 cursor-not-allowed"
                    >
                      Скоро
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Опасная зона */}
        <section className="rounded-xl border border-red-500/20 bg-zinc-900 p-6">
          <h2 className="mb-6 text-lg font-semibold text-[#ff4444]">
            Опасная зона
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-[#ff4444]/50 px-5 py-2.5 text-sm text-[#ff4444] transition-colors hover:border-[#ff4444] hover:bg-[#ff4444]/10"
            >
              Выйти из аккаунта
            </button>
            <button
              onClick={handleDeleteAccount}
              className="rounded-lg bg-[#ff4444] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Удалить аккаунт
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
