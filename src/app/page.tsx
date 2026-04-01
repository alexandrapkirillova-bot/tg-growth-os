import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Навигация */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-12">
        <span className="text-xl font-bold text-[#e8c547]">TG Growth OS</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#e8c547] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Начать бесплатно
          </Link>
        </div>
      </nav>

      {/* Секция 1 — Герой */}
      <section className="px-6 pb-24 pt-20 text-center sm:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full border border-[#e8c547]/30 bg-[#e8c547]/10 px-4 py-1.5 text-sm text-[#e8c547]">
            Инструмент для роста Telegram-каналов
          </div>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Расти быстрее{" "}
            <span className="text-[#e8c547]">в Telegram</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Аналитика, планировщик постов и AI помощник для владельцев Telegram-каналов
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-[#e8c547] px-8 py-3.5 text-base font-semibold text-black transition-opacity hover:opacity-90 sm:w-auto"
            >
              Начать бесплатно
            </Link>
            <Link
              href="/dashboard"
              className="w-full rounded-lg border border-[#e8c547] px-8 py-3.5 text-base font-semibold text-[#e8c547] transition-colors hover:bg-[#e8c547]/10 sm:w-auto"
            >
              Посмотреть демо
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-600">
            Бесплатно навсегда • Без кредитной карты
          </p>
        </div>
      </section>

      {/* Секция 2 — Преимущества */}
      <section className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "📊",
                title: "Глубокая аналитика",
                text: "Узнайте, какие посты работают, когда ваша аудитория онлайн и как растёт канал",
              },
              {
                icon: "📅",
                title: "Планировщик постов",
                text: "Пишите посты заранее и публикуйте их автоматически в нужное время",
              },
              {
                icon: "🤖",
                title: "AI Помощник",
                text: "Генерируйте идеи и тексты постов за секунды с помощью искусственного интеллекта",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Секция 3 — Для кого */}
      <section className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
            Для кого этот инструмент
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Блогеры",
                text: "Растите аудиторию и монетизируйте канал эффективнее",
              },
              {
                title: "Малый бизнес",
                text: "Привлекайте клиентов через Telegram без лишних затрат",
              },
              {
                title: "SMM-специалисты",
                text: "Управляйте несколькими каналами из одного места",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <div className="mb-2 h-1 w-8 rounded-full bg-[#e8c547]" />
                <h3 className="mb-2 mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Секция 4 — Тарифы */}
      <section className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            Простые и честные цены
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            Начните бесплатно, платите только тогда, когда вырастете
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Бесплатный */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-1 text-lg font-semibold text-white">Бесплатный</h3>
              <div className="mb-6 mt-4">
                <span className="text-4xl font-bold text-white">₽0</span>
                <span className="text-zinc-500">/мес</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><Check /> 1 канал</li>
                <li className="flex items-center gap-2"><Check /> Базовая аналитика за 7 дней</li>
                <li className="flex items-center gap-2 text-zinc-600"><Cross /> Планировщик</li>
                <li className="flex items-center gap-2 text-zinc-600"><Cross /> AI помощник</li>
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Начать бесплатно
              </Link>
            </div>

            {/* Стандарт */}
            <div className="relative rounded-xl border-2 border-[#e8c547] bg-zinc-900/50 p-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e8c547] px-3 py-0.5 text-xs font-bold text-black">
                Популярный
              </div>
              <h3 className="mb-1 text-lg font-semibold text-white">Стандарт</h3>
              <div className="mb-6 mt-4">
                <span className="text-4xl font-bold text-white">₽1500</span>
                <span className="text-zinc-500">/мес</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><Check /> 3 канала</li>
                <li className="flex items-center gap-2"><Check /> Аналитика за 30 дней</li>
                <li className="flex items-center gap-2"><Check /> Планировщик постов</li>
                <li className="flex items-center gap-2 text-zinc-600"><Cross /> AI помощник</li>
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-lg bg-[#e8c547] py-2.5 text-center text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Выбрать
              </Link>
            </div>

            {/* Про */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-1 text-lg font-semibold text-white">Про</h3>
              <div className="mb-6 mt-4">
                <span className="text-4xl font-bold text-white">₽4500</span>
                <span className="text-zinc-500">/мес</span>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><Check /> 10 каналов</li>
                <li className="flex items-center gap-2"><Check /> Аналитика без ограничений</li>
                <li className="flex items-center gap-2"><Check /> Планировщик постов</li>
                <li className="flex items-center gap-2"><Check /> AI помощник</li>
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Выбрать
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Секция 5 — Футер */}
      <footer className="border-t border-zinc-800 px-6 py-8 sm:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-lg font-bold text-[#e8c547]">TG Growth OS</span>
          <p className="text-sm text-zinc-500">Сделано для российского рынка 🇷🇺</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/login" className="text-zinc-400 transition-colors hover:text-white">
              Войти
            </Link>
            <Link href="/register" className="text-zinc-400 transition-colors hover:text-white">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#e8c547]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross() {
  return (
    <svg className="h-4 w-4 shrink-0 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
