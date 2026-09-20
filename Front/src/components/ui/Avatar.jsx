import { useState } from "react";

const initialsOf = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const SIZES = {
  xs: "size-5 text-[9px]",
  sm: "size-8 text-[11px]",
  md: "size-10 text-xs",
  lg: "size-12 text-sm",
  xl: "size-32 text-3xl",
};

/**
 * Avatar con respaldo de iniciales.
 *
 * Si la imagen no carga (una URL rota en los datos del usuario, o el servicio
 * de avatares sin red) se muestran las iniciales. Antes solo se ocultaba la
 * imagen y quedaba un circulo vacio casi invisible.
 * El respaldo se guarda por URL, asi que al cambiar de foto se vuelve a
 * intentar sin necesidad de un efecto.
 */
export default function Avatar({ src, name, size = "md", className = "", ring = false }) {
  const [failedSrc, setFailedSrc] = useState(null);

  const dimension = SIZES[size] || SIZES.md;
  const ringClass = ring ? "ring-2 ring-surface" : "";
  const showImage = Boolean(src) && src !== failedSrc;

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft font-bold uppercase text-brand-ink ${dimension} ${ringClass} ${className}`}
      title={name || undefined}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}
