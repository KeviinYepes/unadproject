import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { logout } from "../utils/session";

const SIDEBAR_KEY = "unad-sidebar-collapsed";

/**
 * Marco de la aplicacion.
 *
 * Las ocho pantallas repetian a mano `flex h-screen` + `Sidebar` + `Header` +
 * `overflow-y-auto`. Centralizarlo aqui es lo que permite que la navegacion
 * movil, el estado contraido de la barra y el pie existan una sola vez y se
 * comporten igual en todas partes.
 */
export default function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileNav, setMobileNav] = useState({ open: false, path: pathname });
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === "1";
    } catch {
      return false;
    }
  });

  /*
   * El panel movil se cierra al cambiar de ruta comparando con la ruta en la
   * que se abrio. Derivarlo asi cubre tambien el boton atras del navegador y
   * evita el efecto que cerraba el panel despues de pintar.
   */
  const mobileNavOpen = mobileNav.open && mobileNav.path === pathname;

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
    } catch {
      /* preferencia no persistente, sin consecuencias */
    }
  }, [collapsed]);

  const openMobileNav = () => setMobileNav({ open: true, path: pathname });
  const closeMobileNav = () => setMobileNav({ open: false, path: pathname });

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={closeMobileNav}
        onLogout={() => logout(navigate)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMobileNav={openMobileNav} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1200px]">
            <Outlet />
          </div>
        </main>

        <footer className="no-print border-t border-line px-4 py-5 text-xs text-fg-subtle sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-2">
            <p>Guías Visuales UNAD · Plataforma académica de apoyo en video</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
