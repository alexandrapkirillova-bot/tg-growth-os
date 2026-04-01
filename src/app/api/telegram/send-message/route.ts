import { NextRequest } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  const { chat_id, text } = await request.json();

  if (!chat_id || !text) {
    return Response.json({ error: "Обязательные поля: chat_id, text" }, { status: 400 });
  }

  if (!TOKEN) {
    return Response.json({ error: "Бот не настроен" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text }),
  });

  const data = await res.json();

  if (!data.ok) {
    return Response.json(
      { error: data.description ?? "Ошибка отправки сообщения" },
      { status: 400 }
    );
  }

  return Response.json({ ok: true, message_id: data.result.message_id });
}
