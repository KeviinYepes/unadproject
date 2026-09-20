import { useCallback, useEffect, useMemo, useState } from "react";

const clampPage = (page, totalItems, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.min(Math.max(1, page), totalPages);
};

/**
 * Estado comun de una tabla de recursos: carga, error, avisos, pagina actual y
 * troceado en paginas.
 *
 * Las pantallas de usuarios, roles y categorias repetian exactamente esta
 * combinacion de useState/useEffect. Tenerla en un hook evita que cada una se
 * comporte un poco distinto.
 */
export default function useResourceTable({ load, pageSize = 5, errorMessage = "No se pudo cargar la información." }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const data = await load();
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      console.error(errorMessage, requestError);
      setError(
        requestError?.response?.data?.error ||
          requestError?.response?.data?.message ||
          requestError?.message ||
          errorMessage
      );
    } finally {
      setLoading(false);
    }
  }, [load, errorMessage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setPage((current) => clampPage(current, items.length, pageSize));
  }, [items.length, pageSize]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
    [items, page, pageSize]
  );

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  const changePage = useCallback(
    (nextPage) => setPage(clampPage(nextPage, items.length, pageSize)),
    [items.length, pageSize]
  );

  return {
    items,
    pageItems,
    loading,
    error,
    setError,
    page,
    changePage,
    toast,
    showToast,
    dismissToast: () => setToast(null),
    refresh,
  };
}
