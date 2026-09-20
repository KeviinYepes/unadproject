import { ROLE_ADMIN, ROLE_MODERATOR, ROLE_USER, normalizeRole } from "../utils/role";

const ALL_ROLES = [ROLE_ADMIN, ROLE_MODERATOR, ROLE_USER];

/**
 * Fuente unica de la navegacion.
 *
 * La barra lateral y el titulo del encabezado leen de aqui, de modo que anadir
 * una pantalla es tocar un solo archivo. `matches` permite que una entrada
 * quede activa en rutas relacionadas (por ejemplo la biblioteca mientras se ve
 * un video).
 */
export const NAV_GROUPS = [
  {
    id: "learning",
    label: "Aprendizaje",
    items: [
      {
        to: "/main",
        icon: "home",
        label: "Inicio",
        description: "Resumen y accesos rápidos",
        roles: ALL_ROLES,
      },
      {
        to: "/admin/biblioteca",
        icon: "video_library",
        label: "Biblioteca",
        description: "Guías en video por categoría",
        roles: ALL_ROLES,
        matches: ["/video", "/admin/videos"],
      },
      {
        to: "/foro",
        icon: "forum",
        label: "Foro",
        description: "Dudas y conversaciones",
        roles: ALL_ROLES,
      },
    ],
  },
  {
    id: "admin",
    label: "Administración",
    items: [
      {
        to: "/admin/dashboard",
        icon: "dashboard",
        label: "Panel",
        description: "Métricas de la plataforma",
        roles: [ROLE_ADMIN],
      },
      {
        to: "/admin/users",
        icon: "group",
        label: "Usuarios",
        description: "Altas, edición y bajas",
        roles: [ROLE_ADMIN],
      },
      {
        to: "/admin/roles",
        icon: "admin_panel_settings",
        label: "Roles",
        description: "Perfiles de acceso",
        roles: [ROLE_ADMIN],
      },
      {
        to: "/admin/categories",
        icon: "category",
        label: "Categorías",
        description: "Agrupación del contenido",
        roles: [ROLE_ADMIN],
      },
    ],
  },
];

/** Grupos de navegacion visibles para un rol, sin grupos vacios. */
export const getNavigationForRole = (role) => {
  const currentRole = normalizeRole(role);

  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(currentRole)),
  })).filter((group) => group.items.length > 0);
};

/**
 * Metadatos de cada ruta: titulo, seccion y descripcion corta.
 * Alimenta el encabezado, que antes tenia un hueco vacio a la izquierda.
 */
export const PAGE_META = {
  "/main": {
    title: "Inicio",
    section: "Aprendizaje",
    description: "Tu resumen de la plataforma",
  },
  "/admin/biblioteca": {
    title: "Biblioteca de guías",
    section: "Aprendizaje",
    description: "Contenido en video organizado por categoría",
  },
  "/video": {
    title: "Contenido",
    section: "Biblioteca",
    description: "Video, materiales y dudas",
  },
  "/foro": {
    title: "Foro de ayuda",
    section: "Aprendizaje",
    description: "Conversaciones abiertas desde los contenidos",
  },
  "/profile": {
    title: "Mi perfil",
    section: "Cuenta",
    description: "Tus datos y preferencias",
  },
  "/admin/dashboard": {
    title: "Panel administrativo",
    section: "Administración",
    description: "Rendimiento de la plataforma",
  },
  "/admin/users": {
    title: "Gestión de usuarios",
    section: "Administración",
    description: "Altas, edición y bajas de usuarios",
  },
  "/admin/roles": {
    title: "Gestión de roles",
    section: "Administración",
    description: "Perfiles y permisos de acceso",
  },
  "/admin/categories": {
    title: "Gestión de categorías",
    section: "Administración",
    description: "Agrupación del contenido de la plataforma",
  },
};

export const getPageMeta = (pathname) =>
  PAGE_META[pathname] || { title: "Plataforma", section: "UNAD", description: "" };
