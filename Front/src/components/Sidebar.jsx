import { Link, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";
import { getNavigationForRole } from "../config/navigation";
import { normalizeRole, roleLabel, roleTone } from "../utils/role";
import { Avatar, Badge, Icon } from "./ui";

/**
 * Barra lateral.
 *
 * - Agrupa la navegacion (Aprendizaje / Administracion) en vez de una lista
 *   plana, para que se entienda que hace cada pantalla.
 * - Se contrae a una barra de iconos en escritorio y se convierte en un panel
 *   deslizante en movil, donde antes simplemente estorbaba.
 * - Cierra con la tarjeta del usuario: identidad visible y salida de sesion a
 *   un clic.
 */
export default function Sidebar({
  collapsed = false,
  onToggleCollapsed,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
}) {
  const { pathname } = useLocation();
  const currentUser = AuthService.getCurrentUser();
  const currentRole = normalizeRole(currentUser?.role);
  const groups = getNavigationForRole(currentRole);

  return (
    <>
      {/* Velo del panel movil */}
      <button
        type="button"
        aria-label="Cerrar navegación"
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-scrim/55 transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Navegación principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-line bg-surface transition-[transform,width] duration-200 ease-out lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
          collapsed ? "lg:w-[76px]" : "lg:w-[272px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Marca */}
        <div
          className={`flex h-16 shrink-0 items-center gap-2 border-b border-line px-4 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <Link
            to="/main"
            onClick={onCloseMobile}
            className="flex min-w-0 items-center gap-3"
            title="Guías Visuales UNAD"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-fg">
              <Icon name="play_circle" size={22} filled />
            </span>
            <span className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
              <span className="block truncate text-sm font-extrabold leading-tight text-fg">
                Guías Visuales
              </span>
              <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                UNAD
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            className={`ml-auto hidden size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-subtle hover:text-fg lg:flex ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <Icon name="left_panel_close" size={18} />
          </button>
        </div>

        {/* Navegacion */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group, groupIndex) => (
            <div key={group.id} className={groupIndex > 0 ? "mt-6" : ""}>
              <p
                className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-fg-subtle ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {group.label}
              </p>

              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const allPaths = [item.to, ...(item.matches || [])];
                  const active = allPaths.some(
                    (path) => pathname === path || pathname.startsWith(`${path}/`)
                  );

                  return (
                    <li key={item.to}>
                      <NavigationLink
                        item={item}
                        active={active}
                        collapsed={collapsed}
                        onNavigate={onCloseMobile}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Usuario en sesion */}
        <div className="shrink-0 border-t border-line p-3">
          <div
            className={`flex items-center gap-3 rounded-lg bg-subtle/70 p-3 ${
              collapsed ? "lg:flex-col lg:gap-2 lg:bg-transparent lg:p-0" : ""
            }`}
          >
            <Avatar name={currentUser?.email || "Usuario"} size="sm" />

            <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-xs font-bold text-fg" title={currentUser?.email}>
                {currentUser?.email || "Sesión activa"}
              </p>
              <Badge tone={roleTone(currentRole)} size="sm" className="mt-1">
                {roleLabel(currentRole)}
              </Badge>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * Enlace de navegacion.
 * El estado activo se resuelve con `useLocation` en vez de `NavLink` porque una
 * entrada puede corresponder a varias rutas (la biblioteca sigue activa
 * mientras se esta viendo un video).
 */
function NavigationLink({ item, active, collapsed, onNavigate }) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        collapsed ? "lg:justify-center lg:px-0" : ""
      } ${
        active
          ? "bg-brand-soft font-bold text-brand-ink"
          : "font-medium text-fg-muted hover:bg-subtle hover:text-fg"
      }`}
    >
      {/* Marca de seleccion: barra + color, no solo color */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        } ${collapsed ? "lg:hidden" : ""}`}
      />
      <Icon name={item.icon} size={20} filled={active} />
      <span className={`min-w-0 flex-1 truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
    </Link>
  );
}
