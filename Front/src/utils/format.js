/** Formateadores compartidos. Todos usan `es-CO` para ser consistentes. */

export const getUserName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "Usuario";
};

export const formatDateTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatMonthYear = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(date);
};

/**
 * Periodo de una estadistica, tolerando las dos formas que puede devolver el
 * backend: una fecha exacta o el par mes/anio.
 */
export const formatStatPeriod = (stat) => {
  if (stat?.lastViewAt) {
    const label = formatMonthYear(stat.lastViewAt);
    if (label) return label;
  }

  if (stat?.periodMonth && stat?.periodYear) {
    const label = formatMonthYear(new Date(Number(stat.periodYear), Number(stat.periodMonth) - 1, 1));
    if (label) return label;
  }

  return "Sin visualizaciones";
};

/** Fecha relativa corta ("hoy", "hace 3 d") para listados densos. */
export const formatRelative = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffDays = Math.round((date.getTime() - Date.now()) / 86_400_000);

  if (diffDays === 0) return "hoy";
  if (diffDays === -1) return "ayer";

  const rtf = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");

  return formatMonthYear(date);
};

export const formatNumber = (value) => Number(value || 0).toLocaleString("es-CO");

export const formatFileSize = (value) => {
  const bytes = Number(value);
  if (!bytes || Number.isNaN(bytes)) return "PDF";

  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return null;

  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`;
};
