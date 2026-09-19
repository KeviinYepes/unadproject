export const toInputDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const parseDateInput = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const buildDateRangeLabel = (dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) return "Todo el historico";

  const formatDay = (value) =>
    new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(
      parseDateInput(value)
    );

  if (dateFrom && dateTo) return `${formatDay(dateFrom)} al ${formatDay(dateTo)}`;
  if (dateFrom) return `Desde ${formatDay(dateFrom)}`;
  return `Hasta ${formatDay(dateTo)}`;
};

/**
 * Resuelve un preset de periodo ("all" | "thisMonth" | "lastMonth" | "custom")
 * a un rango {dateFrom, dateTo} en formato de <input type="date"> (yyyy-mm-dd).
 * "all" y "custom" devuelven fechas vacias (el llamador decide que hacer con "custom").
 */
export const resolvePeriodPresetRange = (preset) => {
  if (preset === "all" || preset === "custom") {
    return { dateFrom: "", dateTo: "" };
  }

  const now = new Date();
  const [start, end] =
    preset === "thisMonth"
      ? [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)]
      : [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0)];

  return { dateFrom: toInputDate(start), dateTo: toInputDate(end) };
};

/**
 * Verifica si una fecha/hora exacta (p. ej. createdAt de una conversacion) cae
 * dentro del rango [dateFrom, dateTo] (inclusive, en formato yyyy-mm-dd).
 */
export const isWithinDateRange = (value, dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) return true;

  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return false;

  const from = parseDateInput(dateFrom);
  let to = parseDateInput(dateTo);
  if (to) {
    to = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);
  }

  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
};
