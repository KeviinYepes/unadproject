import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import ForumService from "../services/ForumService";
import useClickOutside from "../hooks/useClickOutside";
import { getPageMeta } from "../config/navigation";
import { useTheme } from "../theme/themeContext";
import { getCurrentProfilePhoto } from "../utils/profilePhoto";
import { logout } from "../utils/session";
import { normalizeRole, roleLabel, roleTone } from "../utils/role";
import { Avatar, Badge, Icon } from "./ui";

/**
 * Encabezado de la aplicacion.
 *
 * Antes era una barra vacia a la izquierda con tres iconos a la derecha. Ahora
 * responde a tres preguntas: donde estoy (seccion + titulo), como busco
 * contenido (buscador con atajo) y como salgo (menu de usuario con cierre de
 * sesion).
 *
 * El comportamiento de notificaciones se conserva tal cual: mismas llamadas a
 * ForumService, mismos eventos de ventana y mismo `state` al navegar al video.
 */
export default function Header({ onOpenMobileNav }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark, toggle } = useTheme();
  const page = getPageMeta(pathname);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationItems, setNotificationItems] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(getCurrentProfilePhoto);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef(null);
  const currentUser = AuthService.getCurrentUser();
  const currentRole = normalizeRole(currentUser?.role);

  const closeProfileMenu = () => setIsProfileMenuOpen(false);
  const closeNotificationMenu = () => setIsNotificationMenuOpen(false);

  const profileRef = useClickOutside(closeProfileMenu, isProfileMenuOpen);
  const notificationRef = useClickOutside(closeNotificationMenu, isNotificationMenuOpen);

  const loadNotifications = async () => {
    try {
      const user = AuthService.getCurrentUser();

      if (!user?.userId) {
        setNotificationCount(0);
        setNotificationItems([]);
        return;
      }

      const summary = await ForumService.getNotifications(user.userId);
      setNotificationCount(Number(summary?.total) || 0);
      setNotificationItems(Array.isArray(summary?.items) ? summary.items : []);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setNotificationCount(0);
      setNotificationItems([]);
    }
  };

  useEffect(() => {
    const loadProfilePhoto = () => setProfilePhoto(getCurrentProfilePhoto());

    window.addEventListener("profile-photo-changed", loadProfilePhoto);
    return () => window.removeEventListener("profile-photo-changed", loadProfilePhoto);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadNotifications, 0);

    window.addEventListener("forum-notifications-changed", loadNotifications);
    window.addEventListener("focus", loadNotifications);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("forum-notifications-changed", loadNotifications);
      window.removeEventListener("focus", loadNotifications);
    };
  }, []);

  // Al cambiar de pantalla se cierran los menus flotantes.
  // No hace falta un efecto: cada accion del menu ya cierra el suyo y
  // `useClickOutside` cierra los que queden abiertos al pulsar en otro sitio.
  const navigateAndClose = (to) => {
    setIsProfileMenuOpen(false);
    setIsNotificationMenuOpen(false);
    navigate(to);
  };

  // Atajo de busqueda: Ctrl/Cmd + K.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openNotificationMenu = async () => {
    setIsNotificationMenuOpen(true);
    await loadNotifications();

    const user = AuthService.getCurrentUser();
    if (!user?.userId) return;

    try {
      await ForumService.markNotificationsSeen(user.userId);
      await loadNotifications();
    } catch (error) {
      console.error("Error marcando notificaciones como vistas:", error);
    }
  };

  const toggleNotificationMenu = () => {
    if (isNotificationMenuOpen) {
      closeNotificationMenu();
      return;
    }

    openNotificationMenu();
  };

  const goToNotification = (notification) => {
    const content = notification.content || {};
    closeNotificationMenu();

    navigate("/video", {
      state: {
        id: content.id,
        title: content.title,
        category: content.category?.categoryName || "Sin categoria",
        description: content.description,
        url: content.urlVideo,
        createdBy: content.createdBy,
      },
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/admin/videos?q=${encodeURIComponent(term)}` : "/admin/videos");
    searchRef.current?.blur();
  };

  const handleLogout = () => {
    closeProfileMenu();
    logout(navigate);
  };

  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        {/* Menu movil */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Abrir navegación"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg lg:hidden"
        >
          <Icon name="menu" size={22} />
        </button>

        {/* Contexto de la pagina */}
        <div className="min-w-0 flex-1">
          <p className="hidden text-[11px] font-bold uppercase tracking-wider text-fg-subtle sm:block">
            {page.section}
          </p>
          <h1 className="truncate text-base font-extrabold leading-tight text-fg">{page.title}</h1>
        </div>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="hidden md:block" role="search">
          <div className="relative">
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <input
              ref={searchRef}
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar en la biblioteca..."
              aria-label="Buscar en la biblioteca"
              className="h-10 w-56 rounded-lg border border-line bg-canvas pl-10 pr-16 text-sm text-fg transition-[width] placeholder:text-fg-subtle focus:w-72 focus:border-brand focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/25 lg:w-64 lg:focus:w-80"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-fg-subtle lg:block">
              Ctrl K
            </kbd>
          </div>
        </form>

        {/* Tema. Medido a 390 px de ancho: el encabezado admite los cuatro
            controles, asi que el interruptor se queda a la vista. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          title={isDark ? "Tema claro" : "Tema oscuro"}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
        >
          <Icon name={isDark ? "light_mode" : "dark_mode"} size={20} />
        </button>

        {/* Notificaciones */}
        <div className="relative shrink-0" ref={notificationRef}>
          <button
            type="button"
            onClick={toggleNotificationMenu}
            aria-label="Notificaciones"
            aria-expanded={isNotificationMenuOpen}
            className="relative flex size-10 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <Icon name="notifications" size={20} filled={notificationCount > 0} />
            {notificationCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-black leading-none text-danger-fg ring-2 ring-surface">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {isNotificationMenuOpen && (
            <div className="absolute right-0 mt-2 w-[min(360px,calc(100vw-2rem))] animate-pop-in overflow-hidden rounded-xl border border-line bg-elevated shadow-pop">
              <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-fg">Notificaciones</p>
                  <p className="text-xs text-fg-muted">
                    {notificationCount > 0
                      ? `${notificationCount} ${notificationCount === 1 ? "conversación pendiente" : "conversaciones pendientes"}`
                      : "Estás al día"}
                  </p>
                </div>
                <Badge tone={notificationCount > 0 ? "brand" : "neutral"} size="sm">
                  {notificationCount}
                </Badge>
              </div>

              {notificationItems.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-fg-muted">
                  No hay conversaciones nuevas por revisar.
                </p>
              ) : (
                <ul className="max-h-80 overflow-y-auto py-1">
                  {notificationItems.map((notification) => (
                    <li key={`${notification.type}-${notification.conversationId}`}>
                      <button
                        type="button"
                        onClick={() => goToNotification(notification)}
                        className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-subtle"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                          <Icon
                            name={notification.type === "ANSWER" ? "reply" : "forum"}
                            size={18}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-fg">
                            {notification.conversationTitle || "Conversación sin título"}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-fg-muted">
                            {notification.content?.title || "Contenido no disponible"}
                          </span>
                          <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-brand-ink">
                            {notification.type === "ANSWER" ? "Te respondieron" : "Nueva duda"}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border-t border-line px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => navigateAndClose("/foro")}
                  className="text-xs font-bold text-brand-ink hover:underline"
                >
                  Ver el foro completo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Usuario */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
            aria-label="Menú de usuario"
            aria-expanded={isProfileMenuOpen}
            className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-subtle"
          >
            <Avatar src={profilePhoto} name={currentUser?.email} size="md" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 animate-pop-in overflow-hidden rounded-xl border border-line bg-elevated shadow-pop">
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Avatar src={profilePhoto} name={currentUser?.email} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-fg" title={currentUser?.email}>
                    {currentUser?.email || "Sesión activa"}
                  </p>
                  <Badge tone={roleTone(currentRole)} size="sm" className="mt-1">
                    {roleLabel(currentRole)}
                  </Badge>
                </div>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => navigateAndClose("/profile")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
                >
                  <Icon name="person" size={18} />
                  Mi perfil
                </button>

                <button
                  type="button"
                  onClick={() => navigateAndClose("/main")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
                >
                  <Icon name="home" size={18} />
                  Ir al inicio
                </button>

                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
                >
                  <Icon name={isDark ? "light_mode" : "dark_mode"} size={18} />
                  {isDark ? "Tema claro" : "Tema oscuro"}
                </button>

                <div className="my-1.5 h-px bg-line" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger-soft"
                >
                  <Icon name="logout" size={18} />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
