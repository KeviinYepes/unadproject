import { Link } from "react-router-dom";
import Icon from "./Icon";

const VARIANTS = {
  primary: "bg-brand text-brand-fg hover:bg-brand-hover shadow-sm",
  soft: "bg-brand-soft text-brand-ink hover:bg-brand/15",
  outline: "border border-line bg-surface text-fg hover:bg-subtle",
  ghost: "text-fg-muted hover:bg-subtle hover:text-fg",
  danger: "bg-danger text-danger-fg hover:opacity-90 shadow-sm",
  dangerSoft: "border border-danger/25 bg-danger-soft text-danger hover:border-danger/45",
  link: "px-0 text-brand-ink hover:underline",
};

const SIZES = {
  sm: "h-9 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  lg: "h-11 gap-2 rounded-lg px-5 text-sm",
  icon: "h-10 w-10 rounded-lg",
  iconSm: "h-9 w-9 rounded-lg",
};

/**
 * Boton unico de la aplicacion.
 * - `variant`: peso visual (primario, contorno, fantasma, destructivo...).
 * - `size`: alto y densidad.
 * - `icon` / `iconRight`: nombre del icono de Material Symbols.
 * - `to` / `href`: renderiza un enlace en vez de un <button>.
 * - `loading`: deshabilita y muestra un indicador sin cambiar el ancho.
 */
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  to,
  href,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const isDisabled = disabled || loading;
  const iconSize = size === "sm" || size === "iconSm" ? 18 : 20;

  const classes = [
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-55",
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? (
        <span
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon && <Icon name={icon} size={iconSize} />
      )}
      {children && <span className="truncate">{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
    </>
  );

  if (to && !isDisabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !isDisabled) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={isDisabled} {...props}>
      {content}
    </button>
  );
}
