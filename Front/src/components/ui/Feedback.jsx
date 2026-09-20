import Icon from "./Icon";

const ALERT_TONES = {
  info: "border-brand/25 bg-brand-soft text-brand-ink",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
};

const ALERT_ICONS = {
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

export function Alert({ tone = "info", title, children, action, className = "" }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`flex flex-wrap items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        ALERT_TONES[tone] || ALERT_TONES.info
      } ${className}`}
    >
      <Icon name={ALERT_ICONS[tone] || ALERT_ICONS.info} size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-bold">{title}</p>}
        <div className={title ? "mt-0.5 opacity-90" : "opacity-90"}>{children}</div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon = "inbox", title, description, action, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line px-6 py-12 text-center ${className}`}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
        <Icon name={icon} size={24} />
      </span>
      <h3 className="text-base font-bold text-fg">{title}</h3>
      {description && <p className="max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/** Esqueleto con la forma real de una tabla, para que el salto sea minimo. */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((__, columnIndex) => (
                <td key={columnIndex}>
                  <Skeleton className={`h-4 ${columnIndex === 0 ? "w-40" : "w-24"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`card overflow-hidden p-4 ${className}`}>
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="mt-4 h-4 w-4/5" />
      <Skeleton className="mt-2 h-3 w-2/5" />
    </div>
  );
}

export function LoadingLine({ label = "Cargando..." }) {
  return (
    <p role="status" className="flex items-center gap-2 py-6 text-sm text-fg-muted">
      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </p>
  );
}
