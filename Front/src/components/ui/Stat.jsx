import Icon from "./Icon";

const TONES = {
  brand: "bg-brand-soft text-brand-ink",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-subtle text-fg-muted",
};

/**
 * Tarjeta de metrica: icono, etiqueta, valor grande y un pie opcional.
 * La usan el home y el panel administrativo para que las cifras se lean igual.
 */
export default function Stat({ icon = "insights", tone = "brand", label, value, hint, footer, className = "" }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`flex size-10 items-center justify-center rounded-lg ${TONES[tone] || TONES.brand}`}>
          <Icon name={icon} size={20} />
        </span>
        {hint && <span className="text-xs font-semibold text-fg-subtle">{hint}</span>}
      </div>

      <p className="mt-4 text-2xl font-extrabold tabular-nums tracking-tight text-fg">{value}</p>
      <p className="mt-1 text-sm font-medium text-fg-muted">{label}</p>

      {footer && <div className="mt-3 border-t border-line pt-3 text-xs text-fg-subtle">{footer}</div>}
    </div>
  );
}
