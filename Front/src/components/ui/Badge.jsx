import Icon from "./Icon";

const TONES = {
  neutral: "border-line bg-subtle text-fg-muted",
  brand: "border-brand/25 bg-brand-soft text-brand-ink",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
  solid: "border-transparent bg-brand text-brand-fg",
};

export default function Badge({ tone = "neutral", icon, size = "md", className = "", children }) {
  const sizing =
    size === "sm"
      ? "gap-1 px-2 py-0.5 text-[10px]"
      : "gap-1.5 px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border font-bold uppercase tracking-wide ${sizing} ${
        TONES[tone] || TONES.neutral
      } ${className}`}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 12 : 14} />}
      <span className="truncate">{children}</span>
    </span>
  );
}
