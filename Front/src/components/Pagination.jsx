const Pagination = ({ page, totalItems, pageSize = 5, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  if (totalItems <= pageSize) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border-light px-6 py-4 text-sm dark:border-border-dark sm:flex-row sm:items-center sm:justify-between">
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        Mostrando {start}-{end} de {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border-light px-3 font-semibold transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark"
        >
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-bold transition ${
                pageNumber === page
                  ? "bg-primary text-white"
                  : "border border-border-light hover:bg-primary/10 hover:text-primary dark:border-border-dark"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border-light px-3 font-semibold transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagination;
