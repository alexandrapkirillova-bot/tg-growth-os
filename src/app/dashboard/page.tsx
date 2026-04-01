"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
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

interface Post {
  id: string;
  text: string;
  views: number;
  created_at: string;
}

interface StatPoint {
  date: string;
  subscribers: number;
}

interface Metrics {
  subscribers: number;
  postsLast7Days: number;
  avgViews: number;
}

export default function DashboardPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<StatPoint[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ subscribers: 0, postsLast7Days: 0, avgViews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: channelsData } = await supabase
        .from("channels")
        .select("id, title, username, subscriber_count")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const chans: Channel[] = channelsData ?? [];
      setChannels(chans);

      if (chans.length === 0) {
        setLoading(false);
        return;
      }

      const channelIds = chans.map((c) => c.id);
      const totalSubscribers = chans.reduce((sum, c) => sum + (c.subscriber_count ?? 0), 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [postsRecent, postsAll, statsData] = await Promise.all([
        supabase
          .from("posts")
          .select("id", { count: "exact", head: true })
          .in("channel_id", channelIds)
          .gte("created_at", sevenDaysAgo.toISOString()),
        supabase
          .from("posts")
          .select("id, text, views, created_at")
          .in("channel_id", channelIds)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("stats")
          .select("date, subscribers")
          .in("channel_id", channelIds)
          .order("date", { ascending: true }),
      ]);

      const allPostsForAvg = postsAll.data ?? [];
      const avgViews =
        allPostsForAvg.length > 0
          ? Math.round(allPostsForAvg.reduce((s, p) => s + (p.views ?? 0), 0) / allPostsForAvg.length)
          : 0;

      setMetrics({
        subscribers: totalSubscribers,
        postsLast7Days: postsRecent.count ?? 0,
        avgViews,
      });
      setPosts(allPostsForAvg);
      setStats(statsData.data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#e8c547]" />
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-zinc-400">У вас нет подключённых каналов</p>
        <Link
          href="/dashboard/add-channel"
          className="rounded-lg bg-[#e8c547] px-6 py-2.5 font-semibold text-black transition-opacity hover:opacity-90"
        >
          Подключить канал
        </Link>
      </div>
    );
  }

  const formattedStats = stats.map((s) => ({
    date: new Date(s.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    subscribers: s.subscribers,
  }));

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Дашборд</h1>
        <Link
          href="/dashboard/add-channel"
          className="self-start rounded-lg bg-[#e8c547] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 sm:self-auto"
        >
          + Подключить канал
        </Link>
      </div>

      {/* Метрики */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Подписчики" value={metrics.subscribers.toLocaleString("ru-RU")} />
        <MetricCard label="Постов за 7 дней" value={metrics.postsLast7Days.toLocaleString("ru-RU")} />
        <MetricCard label="Средние просмотры" value={metrics.avgViews.toLocaleString("ru-RU")} />
      </div>

      {/* График */}
      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">Рост подписчиков</h2>
        {formattedStats.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            Статистика появится после первого обновления
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={formattedStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#e8c547" }}
              />
              <Line
                type="monotone"
                dataKey="subscribers"
                stroke="#e8c547"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#e8c547" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Посты */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">Последние посты</h2>
        {posts.length === 0 ? (
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
                <th className="pb-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-800/50 last:border-0">
                  <td className="py-3 text-zinc-300">
                    {post.text ? post.text.slice(0, 50) + (post.text.length > 50 ? "…" : "") : "—"}
                  </td>
                  <td className="py-3 text-zinc-400">
                    {(post.views ?? 0).toLocaleString("ru-RU")}
                  </td>
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
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-2 text-sm text-zinc-400">{label}</p>
      <p className="text-3xl font-bold text-[#e8c547]">{value}</p>
    </div>
  );
}
