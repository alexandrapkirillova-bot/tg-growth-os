import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  console.log("AI роут вызван, ключ есть:", !!process.env.ANTHROPIC_API_KEY);

  try {
    const { topic, tone, length } = await request.json();

    if (!topic || !tone || !length) {
      return Response.json(
        { error: "Обязательные поля: topic, tone, length" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system:
        "Ты помощник по созданию контента для Telegram-каналов. " +
        "Пиши по-русски, живо и естественно, без канцеляризмов. " +
        "Используй эмодзи умеренно. Пиши как живой человек, не как робот.",
      messages: [
        {
          role: "user",
          content:
            `Напиши 3 разных варианта поста для Telegram на тему: ${topic}\n` +
            `Тон: ${tone}\n` +
            `Длина: ${length}\n` +
            `Разделяй варианты текстом ---ВАРИАНТ---\n` +
            `Только тексты постов, без объяснений и нумерации`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const variants = text
      .split("---ВАРИАНТ---")
      .map((v) => v.trim())
      .filter(Boolean);

    return Response.json({ variants });
  } catch (error) {
    console.error("Ошибка AI генерации:", error);
    return Response.json(
      { error: "Ошибка генерации", details: String(error) },
      { status: 500 }
    );
  }
}
