import { NextRequest } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawUsername = searchParams.get("username");

  if (!rawUsername) {
    return Response.json({ error: "Укажите username канала" }, { status: 400 });
  }

  const username = rawUsername.replace(/^@/, "");

  if (!TOKEN) {
    return Response.json({ error: "Бот не настроен" }, { status: 500 });
  }

  const base = `https://api.telegram.org/bot${TOKEN}`;

  const [chatRes, countRes] = await Promise.all([
    fetch(`${base}/getChat?chat_id=@${username}`),
    fetch(`${base}/getChatMemberCount?chat_id=@${username}`),
  ]);

  const chatData = await chatRes.json();
  const countData = await countRes.json();

  if (!chatData.ok) {
    return Response.json(
      { error: "Канал не найден. Убедитесь, что бот добавлен администратором." },
      { status: 404 }
    );
  }

  const chat = chatData.result;

  return Response.json({
    telegram_id: chat.id,
    title: chat.title ?? "",
    username: chat.username ?? username,
    description: chat.description ?? "",
    subscriber_count: countData.ok ? countData.result : 0,
  });
}
