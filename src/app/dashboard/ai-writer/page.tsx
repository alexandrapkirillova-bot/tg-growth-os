"use client";

import { useState } from "react";

const TONES = [
  "Информативный",
  "Личный и душевный",
  "Смешной и лёгкий",
  "Продающий",
];

const LENGTHS = [
  "Короткий (до 100 слов)",
  "Средний (до 300 слов)",
  "Длинный (до 500 слов)",
];

export default function AIWriterPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [length, setLength] = useState(LENGTHS[0]);
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/ai/generate-caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, tone, length }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Ошибка генерации");
    } else {
      setVariants(data.variants);
    }
  }

  async function handleCopy(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold text-white">AI Помощник</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Опишите тему — AI напишет пост за вас
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Форма */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Тема поста
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Например: моя собака научилась плавать"
                required
                rows={4}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Тон</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Длина
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
              >
                {LENGTHS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#e8c547] py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Генерирую..." : "Сгенерировать"}
            </button>
          </form>
        </div>

        {/* Варианты */}
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Вариант {i + 1}
              </p>

              {loading ? (
                <div className="flex items-center gap-2 py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-[#e8c547]" />
                  <span className="text-sm text-zinc-500">Генерирую...</span>
                </div>
              ) : variants[i] ? (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                    {variants[i]}
                  </p>
                  <button
                    onClick={() => handleCopy(variants[i], i)}
                    className="mt-4 rounded-lg border border-zinc-700 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
                  >
                    {copied === i ? "Скопировано!" : "Копировать"}
                  </button>
                </>
              ) : (
                <p className="py-4 text-sm text-zinc-600">
                  Здесь появится вариант поста
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
