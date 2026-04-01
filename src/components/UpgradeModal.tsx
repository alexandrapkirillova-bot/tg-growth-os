"use client";

interface UpgradeModalProps {
  featureName: string;
  email: string;
  onClose: () => void;
}

const PLANS = [
  {
    key: "standard",
    label: "Стандарт",
    price: "₽1500/мес",
    features: ["3 канала", "Аналитика 30 дней", "Планировщик постов"],
  },
  {
    key: "pro",
    label: "Про",
    price: "₽4500/мес",
    features: ["10 каналов", "Всё включено", "AI Помощник"],
  },
];

export default function UpgradeModal({ featureName, email, onClose }: UpgradeModalProps) {
  function telegramUrl(planLabel: string) {
    const text = `Хочу купить тариф ${planLabel}, мой email: ${email}`;
    return `https://t.me/allesqu?text=${encodeURIComponent(text)}`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          aria-label="Закрыть"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-1 text-lg font-bold text-white">Эта функция недоступна</div>
        <p className="mb-6 text-sm text-zinc-400">
          Для доступа к <span className="text-white">{featureName}</span> необходимо приобрести тариф
        </p>

        {/* Plan cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className="flex flex-col rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            >
              <div className="mb-0.5 font-semibold text-white">{plan.label}</div>
              <div className="mb-3 text-sm text-[#e8c547]">{plan.price}</div>
              <ul className="mb-4 flex-1 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-[#e8c547]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={telegramUrl(plan.label)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-[#e8c547] py-2 text-center text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Написать для оплаты
              </a>
            </div>
          ))}
        </div>

        {/* Payment info */}
        <p className="text-center text-xs text-zinc-600">
          Оплата через СБП: +79100845055 (Сбербанк, Александра Павловна К.)
        </p>
      </div>
    </div>
  );
}
