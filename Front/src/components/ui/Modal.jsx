import { useEffect } from "react";
import Icon from "./Icon";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

/**
 * Dialogo modal.
 * Cierra con Escape y con clic en el fondo, bloquea el scroll del documento
 * mientras esta abierto y devuelve el foco al primer control del formulario.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  size = "md",
  dismissible = true,
  children,
  footer,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && dismissible) {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={() => dismissible && onClose?.()}
        className="absolute inset-0 animate-fade-in cursor-default bg-scrim/55 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[92vh] w-full flex-col animate-pop-in overflow-hidden rounded-t-2xl border border-line bg-elevated shadow-pop sm:rounded-2xl ${
          SIZES[size] || SIZES.md
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                <Icon name={icon} size={20} />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-base font-bold text-fg">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={!dismissible}
            aria-label="Cerrar"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-subtle/50 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
