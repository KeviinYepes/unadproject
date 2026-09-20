import AuthService from "../services/AuthService";

/**
 * La foto de perfil se guarda en el navegador bajo `profilePhoto:<userId>`.
 * Esa clave la comparten el encabezado y la pantalla de perfil, asi que se
 * define aqui una sola vez.
 */
export const getPhotoKey = (userId) => `profilePhoto:${userId || "current"}`;

export const buildDefaultPhoto = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Usuario UNAD")}&background=2563eb&color=fff&size=256`;

export const readStoredPhoto = (userId) => {
  try {
    return localStorage.getItem(getPhotoKey(userId));
  } catch {
    return null;
  }
};

/** Foto del usuario en sesion: la guardada o el avatar generado por defecto. */
export const getCurrentProfilePhoto = () => {
  const currentUser = AuthService.getCurrentUser();
  return (
    readStoredPhoto(currentUser?.userId) ||
    buildDefaultPhoto(currentUser?.email || "Usuario UNAD")
  );
};
