"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ChannelInfo {
  telegram_id: number;
  title: string;
  username: string;
  subscriber_count: number;
  description: string;
}

export default function AddChannelPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setChannel(null);
    setSearching(true);

    const res = await fetch(
      `/api/telegram/channel-info?username=${encodeURIComponent(username)}`
    );
    const data = await res.json();

    setSearching(false);

    if (!res.ok) {
      setError(data.error ?? "Ошибка при поиске канала");
    } else {
      setChannel(data);
    }
  }

  async function handleConnect() {
    if (!channel) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const payload = {
      user_id: user.id,
      telegram_id: Number(channel.telegram_id),
      username: channel.username,
      title: channel.title,
      subscriber_count: Number(channel.subscriber_count),
    };

    console.log("Сохранение канала в Supabase:", payload);

    const { error } = await supabase.from("channels").insert(payload);

    setSaving(false);

    if (error) {
      console.error("Ошибка Supabase:", error);
      setError(`Ошибка при сохранении канала: ${error.message}`);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10">
      <div className="mx-auto max-w-lg">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Назад
        </button>

        <h1 className="mb-2 text-3xl font-bold text-white">Подключить канал</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Добавьте бота{" "}
          <span className="text-zinc-400">@tg_growth_os_bot</span>{" "}
          администратором канала перед подключением
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="@username_канала"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-lg bg-[#e8c547] px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {searching ? "Поиск..." : "Найти канал"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {channel && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">{channel.title}</h2>
              <p className="text-sm text-zinc-400">@{channel.username}</p>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl font-bold text-[#e8c547]">
                {channel.subscriber_count.toLocaleString("ru-RU")}
              </span>
              <span className="text-sm text-zinc-400">подписчиков</span>
            </div>

            {channel.description && (
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                {channel.description}
              </p>
            )}

            <button
              onClick={handleConnect}
              disabled={saving}
              className="w-full rounded-lg bg-[#e8c547] py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Подключить"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
