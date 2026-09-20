/**
 * Encabezado de pagina: titulo, descripcion y acciones.
 * Unifica el espacio que hay entre el encabezado y el contenido en todas las
 * pantallas, que era justo lo que variaba de una pagina a otra.
 */
export default function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-fg-subtle">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-extrabold text-fg sm:text-[28px] sm:leading-tight">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-fg-muted">{description}</p>}
        {children}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
    </header>
  );
}
