"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface Channel {
  id: string;
  title: string;
  username: string;
  subscriber_count: number;
}

interface StatPoint {
  date: string;
  subscribers: number;
}

interface Post {
  id: string;
  text: string;
  views: number;
  forwards: number;
  created_at: string;
}

interface Metrics {
  subscribers: number;
  growth7d: number | null;
  avgViews: number;
  bestPost: number;
}

const EMPTY_METRICS: Metrics = { subscribers: 0, growth7d: null, avgViews: 0, bestPost: 0 };

export default function AnalyticsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS);
  const [stats, setStats] = useState<StatPoint[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChannels() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("channels")
        .select("id, title, username, subscriber_count")
        .eq("user_id", user.id)
        .order("title");

      const chans = data ?? [];
      setChannels(chans);
      if (chans.length > 0) setSelectedId(chans[0].id);
    }

    loadChannels();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);

      const channel = channels.find((c) => c.id === selectedId);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [statsRes, postsRes] = await Promise.all([
        supabase
          .from("stats")
          .select("date, subscribers")
          .eq("channel_id", selectedId)
          .gte("date", sevenDaysAgo.toISOString().split("T")[0])
          .order("date", { ascending: true }),
        supabase
          .from("posts")
          .select("id, text, views, forwards, created_at")
          .eq("channel_id", selectedId)
          .order("views", { ascending: false })
          .limit(50),
      ]);

      const statsData: StatPoint[] = statsRes.data ?? [];
      const postsData: Post[] = postsRes.data ?? [];

      const growth7d =
        statsData.length >= 2
          ? statsData[statsData.length - 1].subscribers - statsData[0].subscribers
          : null;

      const avgViews =
        postsData.length > 0
          ? Math.round(postsData.reduce((s, p) => s + (p.views ?? 0), 0) / postsData.length)
          : 0;

      const bestPost = postsData.length > 0 ? Math.max(...postsData.map((p) => p.views ?? 0)) : 0;

      setMetrics({
        subscribers: channel?.subscriber_count ?? 0,
        growth7d,
        avgViews,
        bestPost,
      });
      setStats(statsData);
      setPosts(postsData);
      setLoading(false);
    }

    loadData();
  }, [selectedId, channels]);

  const chartStats = stats.map((s) => ({
    date: new Date(s.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    subscribers: s.subscribers,
  }));

  const chartPosts = posts.slice(0, 15).map((p) => ({
    label: (p.text ?? "").slice(0, 20) || "—",
    views: p.views ?? 0,
  }));

  const topPosts = [...posts]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 10);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Аналитика</h1>

        {channels.length > 0 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white outline-none focus:border-[#e8c547]"
          >
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.title} (@{ch.username})
              </option>
            ))}
          </select>
        )}
      </div>

      {channels.length === 0 ? (
        <p className="text-center text-zinc-500">Нет подключённых каналов</p>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#e8c547]" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Метрики */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Подписчики" value={metrics.subscribers.toLocaleString("ru-RU")} />
            <MetricCard
              label="Прирост за 7 дней"
              value={
                metrics.growth7d === null
                  ? "—"
                  : (metrics.growth7d >= 0 ? "+" : "") + metrics.growth7d.toLocaleString("ru-RU")
              }
              accent={metrics.growth7d !== null && metrics.growth7d >= 0}
            />
            <MetricCard label="Средние просмотры" value={metrics.avgViews.toLocaleString("ru-RU")} />
            <MetricCard label="Лучший пост" value={metrics.bestPost.toLocaleString("ru-RU")} />
          </div>

          {/* График подписчиков */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Динамика подписчиков</h2>
            {chartStats.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">
                Статистика появится после первого обновления
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                    labelStyle={{ color: "#a1a1aa" }}
                    itemStyle={{ color: "#e8c547" }}
                  />
                  <Line type="monotone" dataKey="subscribers" stroke="#e8c547" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#e8c547" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* График просмотров */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Просмотры постов</h2>
            {chartPosts.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">
                Посты появятся после первого обновления
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartPosts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                    labelStyle={{ color: "#a1a1aa" }}
                    itemStyle={{ color: "#e8c547" }}
                    cursor={{ fill: "rgba(232,197,71,0.05)" }}
                  />
                  <Bar dataKey="views" fill="#e8c547" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Топ постов */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Топ постов по просмотрам</h2>
            {topPosts.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">
                Посты появятся после первого обновления
              </p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-zinc-500">
                    <th className="pb-3 font-medium">Текст</th>
                    <th className="pb-3 font-medium">Просмотры</th>
                    <th className="pb-3 font-medium">Пересылки</th>
                    <th className="pb-3 font-medium">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post) => (
                    <tr key={post.id} className="border-b border-zinc-800/50 last:border-0">
                      <td className="py-3 text-zinc-300">
                        {(post.text ?? "").slice(0, 60)}{(post.text ?? "").length > 60 ? "…" : ""}
                      </td>
                      <td className="py-3 text-zinc-400">{(post.views ?? 0).toLocaleString("ru-RU")}</td>
                      <td className="py-3 text-zinc-400">{(post.forwards ?? 0).toLocaleString("ru-RU")}</td>
                      <td className="py-3 text-zinc-500">
                        {new Date(post.created_at).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-2 text-sm text-zinc-400">{label}</p>
      <p className={`text-3xl font-bold ${accent ? "text-green-400" : "text-[#e8c547]"}`}>{value}</p>
    </div>
  );
}
