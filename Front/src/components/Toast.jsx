import Icon from "./ui/Icon";

const TONES = {
  success: { icon: "check_circle", title: "Listo", box: "bg-success-soft text-success" },
  error: { icon: "error", title: "Algo salió mal", box: "bg-danger-soft text-danger" },
  info: { icon: "info", title: "Información", box: "bg-brand-soft text-brand-ink" },
};

/**
 * Aviso flotante.
 * Conserva la misma interfaz que antes (`message`, `type`, `onClose`) para no
 * tocar las pantallas que ya lo usaban.
 */
export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const tone = TONES[type] || TONES.success;

  return (
    <div
      className="no-print pointer-events-none fixed inset-x-4 top-4 z-[70] flex justify-center sm:inset-x-auto sm:right-6 sm:top-6 sm:justify-end"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex w-full max-w-[420px] animate-slide-in-right items-start gap-3 rounded-xl border border-line bg-elevated p-4 shadow-pop">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone.box}`}>
          <Icon name={tone.icon} size={20} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-fg">{tone.title}</p>
          <p className="mt-0.5 text-sm leading-5 text-fg-muted">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar mensaje"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-subtle hover:text-fg"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}
