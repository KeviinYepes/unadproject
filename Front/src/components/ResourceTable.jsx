import Card from "./ui/Card";
import { EmptyState, TableSkeleton } from "./ui/Feedback";
import Icon from "./ui/Icon";
import Pagination from "./Pagination";

/**
 * Tabla de recursos con cabecera, estados y paginacion.
 *
 * Las columnas se declaran como datos (`{ key, label, render }`) en lugar de
 * repetir el marcado de <table> en cada pantalla. Asi la densidad, el hover y
 * los encabezados son identicos en usuarios, roles, categorias y estadisticas.
 */
export default function ResourceTable({
  icon,
  title,
  subtitle,
  action,
  columns,
  rows,
  rowKey = (row) => row.id,
  loading = false,
  emptyIcon = "inbox",
  emptyTitle = "Sin registros",
  emptyDescription,
  emptyAction,
  page,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "registros",
}) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
              <Icon name={icon} size={20} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-bold text-fg">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-fg-muted">{subtitle}</p>}
          </div>
        </div>

        {action}
      </div>

      {loading ? (
        <TableSkeleton rows={pageSize} columns={columns.length} />
      ) : rows.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : undefined}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={rowKey(row)}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`${column.cellClassName || ""} ${
                          column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : ""
                        }`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
            itemLabel={itemLabel}
          />
        </>
      )}
    </Card>
  );
}
