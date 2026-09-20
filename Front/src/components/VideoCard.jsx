import Icon from "./ui/Icon";
import ContentThumbnail from "./ContentThumbnail";
import { getPrimaryMaterialFormat } from "../utils/materialFormats";

/**
 * Tarjeta de contenido en video.
 *
 * La duracion pasa a ser una etiqueta sobre la miniatura (donde se busca) en
 * vez de un texto suelto junto a la categoria, y la tarjeta entera es un
 * objetivo claro: miniatura, titulo y una invitacion explicita a entrar.
 *
 * Cuando el contenido no tiene video (isMaterialOnly), la miniatura y el
 * icono de accion reflejan el formato del material principal (PDF, DOC,
 * imagen, etc.) en vez de asumir siempre un reproductor de video.
 */
export default function VideoCard({
  title,
  category,
  duration,
  imageUrl,
  description,
  isMaterialOnly = false,
  materials = [],
  views,
}) {
  const primaryFormat = getPrimaryMaterialFormat(materials);
  const actionIcon = isMaterialOnly ? primaryFormat.icon : "play_arrow";

  return (
    <article className="card group h-full overflow-hidden transition-shadow hover:shadow-pop">
      <div className="relative aspect-video w-full overflow-hidden bg-subtle">
        <ContentThumbnail
          title={title}
          imageUrl={imageUrl}
          materials={materials}
          isMaterialOnly={isMaterialOnly}
        />

        {/* Velo y boton de reproduccion/accion al pasar el cursor */}
        <div className="absolute inset-0 flex items-center justify-center bg-scrim/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-surface/95 text-brand-ink shadow-pop">
            <Icon name={actionIcon} size={26} filled />
          </span>
        </div>

        {duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-scrim/80 px-2 py-0.5 text-[11px] font-bold tabular-nums text-white">
            {duration}
          </span>
        )}

        {materials.length > 0 && (
          <div
            className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black shadow-sm ${primaryFormat.tone}`}
          >
            <Icon name={primaryFormat.icon} size={14} />
            {primaryFormat.label}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-ink">{category}</p>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-5 text-fg">{title}</h3>

        {typeof views === "number" && (
          <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-fg-subtle">
            <Icon name="visibility" size={13} />
            {views === 1 ? "1 visita" : `${views} visitas`}
          </span>
        )}

        {description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-fg-muted">{description}</p>
        )}

        <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-bold text-fg-subtle transition-colors group-hover:text-brand-ink">
          <Icon name="play_circle" size={16} />
          Ver la guía
        </span>
      </div>
    </article>
  );
}
