import Button from "./ui/Button";
import Icon from "./ui/Icon";

/** Ventana de paginas alrededor de la actual, con elipsis si hay muchas. */
const buildPageWindow = (page, totalPages, span = 1) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page]);
  for (let offset = 1; offset <= span; offset += 1) {
    pages.add(page - offset);
    pages.add(page + offset);
  }

  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  const withGaps = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      withGaps.push("gap");
    }
    withGaps.push(value);
  });

  return withGaps;
};

/**
 * Paginacion de tablas.
 *
 * La version anterior dibujaba un boton por cada pagina existente; con un
 * listado largo eso convertia el pie en una fila de botones. Ahora muestra una
 * ventana centrada en la pagina actual.
 */
const Pagination = ({ page, totalItems, pageSize = 5, onPageChange, itemLabel = "registros" }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  if (totalItems <= pageSize) return null;

  const pages = buildPageWindow(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-fg-muted">
        Mostrando <span className="font-bold text-fg">{start}</span>–
        <span className="font-bold text-fg">{end}</span> de{" "}
        <span className="font-bold text-fg">{totalItems}</span> {itemLabel}
      </p>

      <nav className="flex items-center gap-1.5" aria-label="Paginación">
        <Button
          variant="outline"
          size="iconSm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <Icon name="chevron_left" size={18} />
        </Button>

        {pages.map((entry, index) =>
          entry === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-fg-subtle" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-bold transition-colors ${
                entry === page
                  ? "bg-brand text-brand-fg"
                  : "border border-line text-fg-muted hover:bg-subtle hover:text-fg"
              }`}
            >
              {entry}
            </button>
          )
        )}

        <Button
          variant="outline"
          size="iconSm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
        >
          <Icon name="chevron_right" size={18} />
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;
