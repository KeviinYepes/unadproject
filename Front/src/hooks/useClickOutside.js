import { useEffect, useRef } from "react";

/**
 * Cierra un panel flotante (menus, dropdowns) al hacer clic fuera o al pulsar
 * Escape. Reemplaza el listener manual que tenia el encabezado.
 */
export default function useClickOutside(onClose, active = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose?.();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, active]);

  return ref;
}
