export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      icon: "check_circle",
      title: "Operacion exitosa",
      container: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-100",
      iconBox: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    },
    error: {
      icon: "error",
      title: "Algo salio mal",
      container: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/90 dark:text-red-100",
      iconBox: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    },
  };

  const current = styles[type] || styles.success;

  return (
    <div className="fixed right-6 top-6 z-[70] w-[min(420px,calc(100vw-2rem))]">
      <div
        className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur ${current.container}`}
        role="status"
      >
        <span className={`material-symbols-outlined rounded-lg p-2 text-xl ${current.iconBox}`}>
          {current.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{current.title}</p>
          <p className="mt-1 text-sm leading-5">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Cerrar mensaje"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
