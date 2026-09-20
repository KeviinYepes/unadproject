import { createContext, useContext } from "react";

export const THEME_STORAGE_KEY = "unad-theme";

export const ThemeContext = createContext(null);

/**
 * Acceso al tema actual.
 * Vive en su propio archivo (sin componentes) para que el plugin de fast
 * refresh pueda tratar ThemeProvider.jsx como un modulo de solo componentes.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }

  return context;
}
