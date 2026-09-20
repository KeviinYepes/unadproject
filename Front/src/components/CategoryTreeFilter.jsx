import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./ui/Icon";

/**
 * Arbol de categorias de la biblioteca.
 *
 * Conserva la interfaz y el comportamiento (filtro por categoria, navegacion
 * al video con `state`, soporte de teclado) y anade: recuento total, estado
 * vacio por categoria y un tratamiento visual acorde al resto del sistema.
 */
export default function CategoryTreeFilter({
  categories = [],
  videos = [],
  selectedCategory = "",
  onSelectCategory,
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(() => new Set());

  const categoryNodes = useMemo(() => {
    const fallbackCategories =
      categories.length > 0
        ? categories
        : [...new Set(videos.map((video) => video.category).filter(Boolean))].map((categoryName) => ({
            categoryName,
          }));

    return fallbackCategories
      .map((category) => {
        const name = category.categoryName || category.name || String(category);
        const children = videos.filter((video) => video.category === name);
        return { id: category.id ?? name, name, videos: children };
      })
      .filter((category) => category.name);
  }, [categories, videos]);

  const toggleExpanded = (categoryName) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(categoryName)) next.delete(categoryName);
      else next.add(categoryName);
      return next;
    });
  };

  const selectCategory = (categoryName) => {
    onSelectCategory?.(selectedCategory === categoryName ? "" : categoryName);
  };

  const handleKeyDown = (event, action, categoryName) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    action(categoryName);
  };

  const goToVideo = (video) => {
    navigate("/video", { state: video });
  };

  const treeProps = {
    categoryNodes,
    expanded,
    onSelectCategory,
    selectedCategory,
    selectCategory,
    toggleExpanded,
    goToVideo,
    handleKeyDown,
    totalVideos: videos.length,
  };

  return (
    // `self-start`: en la rejilla de la biblioteca la tarjeta no debe estirarse
    // hasta la altura de la lista de videos.
    <aside className="card self-start overflow-hidden">
      {/* En movil el filtro se pliega para dejar sitio al contenido */}
      <details className="group lg:hidden" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-bold text-fg">
          <span className="flex items-center gap-2">
            <Icon name="account_tree" size={18} className="text-fg-subtle" />
            Categorías
          </span>
          <Icon
            name="expand_more"
            size={18}
            className="text-fg-subtle transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-line p-2">
          <TreeContent {...treeProps} />
        </div>
      </details>

      <div className="hidden lg:block">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
          <Icon name="account_tree" size={18} className="text-fg-subtle" />
          <h2 className="text-sm font-bold text-fg">Categorías</h2>
        </div>
        <div className="p-2">
          <TreeContent {...treeProps} />
        </div>
      </div>
    </aside>
  );
}

function TreeContent({
  categoryNodes,
  expanded,
  onSelectCategory,
  selectedCategory,
  selectCategory,
  toggleExpanded,
  goToVideo,
  handleKeyDown,
  totalVideos,
}) {
  const rowClass = (active) =>
    `flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
      active
        ? "bg-brand-soft font-bold text-brand-ink"
        : "text-fg-muted hover:bg-subtle hover:text-fg"
    }`;

  const countClass = "shrink-0 rounded-full bg-subtle px-2 py-0.5 text-[11px] font-bold text-fg-muted";

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => onSelectCategory?.("")}
        className={rowClass(!selectedCategory)}
        aria-pressed={!selectedCategory}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon name="apps" size={18} />
          <span className="truncate">Todas las categorías</span>
        </span>
        <span className={countClass}>{totalVideos}</span>
      </button>

      {categoryNodes.length === 0 && (
        <p className="px-3 py-4 text-xs text-fg-subtle">Aún no hay categorías registradas.</p>
      )}

      {categoryNodes.map((category) => {
        const isExpanded = expanded.has(category.name);
        const isSelected = selectedCategory === category.name;
        const isEmpty = category.videos.length === 0;

        return (
          <div key={category.id} className="flex flex-col">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleExpanded(category.name)}
                onKeyDown={(event) => handleKeyDown(event, toggleExpanded, category.name)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Contraer categoría" : "Expandir categoría"}
                disabled={isEmpty}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-subtle hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon
                  name="chevron_right"
                  size={18}
                  className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>

              <button
                type="button"
                onClick={() => selectCategory(category.name)}
                onKeyDown={(event) => handleKeyDown(event, selectCategory, category.name)}
                className={rowClass(isSelected)}
                aria-pressed={isSelected}
              >
                <span className="truncate">{category.name}</span>
                <span className={countClass}>{category.videos.length}</span>
              </button>
            </div>

            {isExpanded && !isEmpty && (
              <ul className="ml-9 mt-0.5 flex flex-col gap-0.5 border-l border-line pl-2">
                {category.videos.map((video) => (
                  <li key={video.id}>
                    <button
                      type="button"
                      onClick={() => goToVideo(video)}
                      className="flex min-h-9 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-fg-muted transition-colors hover:bg-subtle hover:text-brand-ink"
                    >
                      <Icon name="play_circle" size={16} className="shrink-0" />
                      <span className="min-w-0 break-words">{video.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
