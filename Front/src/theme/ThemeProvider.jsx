import { useCallback, useEffect, useMemo, useState } from "react";
import { THEME_STORAGE_KEY, ThemeContext } from "./themeContext";

/**
 * El tema inicial ya lo escribio el script de `index.html` antes del primer
 * pintado, asi que aqui solo se lee. Si no existe, se asume claro.
 */
const readInitialMode = () => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readInitialMode);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.classList.toggle("dark", mode === "dark");

    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* Un almacenamiento no disponible no debe romper el cambio de tema. */
    }
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ mode, isDark: mode === "dark", setMode, toggle }),
    [mode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
