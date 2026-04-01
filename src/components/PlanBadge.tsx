interface PlanBadgeProps {
  plan: string;
  large?: boolean;
}

const CONFIGS: Record<string, { label: string; bg: string; color: string }> = {
  founder: { label: "Founder",  bg: "#e8c547",              color: "#000" },
  free:    { label: "Free",     bg: "rgba(255,255,255,0.1)", color: "#999" },
  standard:{ label: "Стандарт", bg: "#1d4ed8",              color: "#fff" },
  pro:     { label: "Про",      bg: "#15803d",              color: "#fff" },
};

export default function PlanBadge({ plan, large = false }: PlanBadgeProps) {
  const cfg = CONFIGS[plan] ?? CONFIGS.free;
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        padding: large ? "4px 12px" : "2px 8px",
        fontSize: large ? 13 : 11,
        borderRadius: 999,
        fontWeight: 600,
        display: "inline-block",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}
