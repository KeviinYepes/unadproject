/**
 * Envoltorio de Material Symbols.
 * Centralizarlo evita repetir el nombre de la fuente y las variaciones de
 * estilo en cada componente.
 */
export default function Icon({ name, size = 20, filled = false, className = "", title, style }) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "fill" : ""} ${className}`}
      style={{ fontSize: `${size}px`, ...style }}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      title={title}
    >
      {name}
    </span>
  );
}
