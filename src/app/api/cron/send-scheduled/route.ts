import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const now = new Date().toISOString();
  console.log("Cron запущен, текущее время UTC:", now);

  const { data: posts, error } = await supabase
    .from("scheduled_posts")
    .select("id, channel_id, text")
    .eq("status", "pending")
    .lte("scheduled_at", now);

  if (error) {
    console.log("Ошибка запроса scheduled_posts:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  console.log(`Найдено pending постов: ${posts?.length ?? 0}`, posts);

  if (!posts || posts.length === 0) {
    return Response.json({ sent: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`Обработка поста id=${post.id}, channel_id=${post.channel_id}`);

    const { data: channel, error: channelError } = await supabase
      .from("channels")
      .select("telegram_id")
      .eq("id", post.channel_id)
      .single();

    if (channelError || !channel?.telegram_id) {
      console.log(`Канал не найден или нет telegram_id для channel_id=${post.channel_id}:`, channelError?.message);
      await supabase.from("scheduled_posts").update({ status: "error" }).eq("id", post.id);
      failed++;
      continue;
    }

    console.log(`Отправка в Telegram, chat_id=${channel.telegram_id}, текст: "${post.text.slice(0, 50)}..."`);

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: channel.telegram_id, text: post.text }),
    });

    const result = await res.json();
    console.log(`Результат отправки поста id=${post.id}:`, result);

    if (res.ok && result.ok) {
      await supabase.from("scheduled_posts").update({ status: "sent" }).eq("id", post.id);
      console.log(`Пост id=${post.id} успешно отправлен`);
      sent++;
    } else {
      console.log(`Ошибка отправки поста id=${post.id}: ${result.description ?? "неизвестная ошибка"}`);
      await supabase.from("scheduled_posts").update({ status: "error" }).eq("id", post.id);
      failed++;
    }
  }

  console.log(`Cron завершён. Отправлено: ${sent}, ошибок: ${failed}`);
  return Response.json({ sent, failed });
}
