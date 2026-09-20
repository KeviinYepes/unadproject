import Icon from "./Icon";

export default function Card({ as, className = "", padded = true, children, ...props }) {
  // `Tag` en mayusculas para poder renderizar un elemento distinto de <section>.
  const Tag = as || "section";

  return (
    <Tag className={`card ${padded ? "p-6" : ""} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Cabecera de tarjeta: titulo, descripcion, icono opcional y una accion a la
 * derecha. Se usa en casi todas las pantallas para que el ritmo vertical sea
 * el mismo en toda la aplicacion.
 */
export function CardHeader({ title, subtitle, icon, action, className = "" }) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-4 ${className}`}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
            <Icon name={icon} size={20} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-fg">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>}
        </div>
      </div>

      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
  return <div className={`mt-6 border-t border-line pt-4 ${className}`}>{children}</div>;
}
