import AuthService from "../services/AuthService";
import { getPhotoKey } from "./profilePhoto";

/**
 * Cierre de sesion.
 *
 * Estaba escrito dentro de la pantalla de perfil, asi que la unica forma de
 * salir era entrar ahi. Ahora vive en un solo lugar y lo usan tanto el
 * encabezado como el perfil.
 */
export const logout = (navigate) => {
  const currentUser = AuthService.getCurrentUser();

  try {
    localStorage.removeItem(getPhotoKey(currentUser?.userId));
  } catch {
    /* sin almacenamiento disponible, la sesion igual debe cerrarse */
  }

  AuthService.logout();
  window.dispatchEvent(new CustomEvent("profile-photo-changed"));
  navigate?.("/login", { replace: true });
};
