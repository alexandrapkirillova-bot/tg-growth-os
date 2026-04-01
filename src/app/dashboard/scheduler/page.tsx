"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_LENGTH = 4096;

interface Channel {
  id: string;
  title: string;
  username: string;
}

interface ScheduledPost {
  id: string;
  text: string;
  scheduled_at: string;
  status: "pending" | "sent" | "error";
}

const STATUS_LABEL: Record<ScheduledPost["status"], string> = {
  pending: "Ожидает",
  sent: "Отправлен",
  error: "Ошибка",
};

const STATUS_COLOR: Record<ScheduledPost["status"], string> = {
  pending: "text-[#e8c547]",
  sent: "text-[#3ddc84]",
  error: "text-[#ff4444]",
};

export default function SchedulerPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [text, setText] = useState("");
  const [channelId, setChannelId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: chans } = await supabase
        .from("channels")
        .select("id, title, username")
        .eq("user_id", user.id)
        .order("title");

      setChannels(chans ?? []);
      if (chans && chans.length > 0) setChannelId(chans[0].id);

      await loadPosts(user.id);
    }

    load();
  }, []);

  async function loadPosts(userId: string) {
    const { data: chans } = await supabase
      .from("channels")
      .select("id")
      .eq("user_id", userId);

    const ids = (chans ?? []).map((c) => c.id);
    if (ids.length === 0) return;

    const { data } = await supabase
      .from("scheduled_posts")
      .select("id, text, scheduled_at, status")
      .in("channel_id", ids)
      .order("scheduled_at", { ascending: false });

    setPosts(data ?? []);
  }

  async function handleDelete(postId: string) {
    await supabase.from("scheduled_posts").delete().eq("id", postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!channelId) {
      setError("Выберите канал");
      return;
    }
    if (!scheduledAt) {
      setError("Укажите дату и время публикации");
      return;
    }

    setSaving(true);

    const localDate = new Date(scheduledAt);
    const utcDate = new Date(localDate.getTime() - 3 * 60 * 60 * 1000);

    const { error: insertError } = await supabase.from("scheduled_posts").insert({
      channel_id: channelId,
      text,
      scheduled_at: utcDate.toISOString(),
      status: "pending",
    });

    setSaving(false);

    if (insertError) {
      setError("Ошибка при сохранении: " + insertError.message);
      return;
    }

    setText("");
    setScheduledAt("");
    setSuccess(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) await loadPosts(user.id);
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <h1 className="mb-8 text-2xl font-bold text-white">Планировщик</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Форма */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Новый пост</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Канал</label>
              {channels.length === 0 ? (
                <p className="text-sm text-zinc-500">Нет подключённых каналов</p>
              ) : (
                <select
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title} (@{ch.username})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Текст поста</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
                placeholder="Напишите текст поста..."
                required
                rows={8}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
              />
              <p className={`mt-1 text-right text-xs ${text.length >= MAX_LENGTH ? "text-[#ff4444]" : "text-zinc-500"}`}>
                {text.length} / {MAX_LENGTH}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Дата и время публикации
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547] [color-scheme:dark]"
              />
              <p className="mt-1 text-xs text-zinc-500">Время московское (UTC+3)</p>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg border border-[#e8c547]/30 bg-[#e8c547]/10 px-3 py-2 text-sm text-[#e8c547]">
                Пост запланирован!
              </p>
            )}

            <button
              type="submit"
              disabled={saving || channels.length === 0}
              className="mt-2 w-full rounded-lg bg-[#e8c547] py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Запланировать пост"}
            </button>
          </form>
        </div>

        {/* Список постов */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Запланированные посты</h2>

          {posts.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              Нет запланированных постов
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4"
                >
                  <p className="mb-3 text-sm leading-relaxed text-zinc-300">
                    {post.text.slice(0, 100)}
                    {post.text.length > 100 ? "…" : ""}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      {new Date(post.scheduled_at).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${STATUS_COLOR[post.status]}`}>
                        {STATUS_LABEL[post.status]}
                      </span>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-zinc-600 transition-colors hover:text-red-400"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
