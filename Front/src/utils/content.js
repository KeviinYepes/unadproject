/**
 * Forma que espera la pantalla de video (`/video`) al recibir el contenido por
 * `location.state`. Estaba escrita a mano en tres sitios distintos (biblioteca,
 * foro y notificaciones) y era facil que se desincronizaran.
 */
export const getCategoryLabel = (category) => {
  if (typeof category === "string" && category.trim()) return category;
  return category?.categoryName || "Sin categoría";
};

export const getContentUrl = (content) => content?.url || content?.urlVideo || "";

export const toContentState = (content) => ({
  id: content?.id,
  title: content?.title,
  category: getCategoryLabel(content?.category),
  createdBy: content?.createdBy,
  description: content?.description,
  url: getContentUrl(content),
  materials: Array.isArray(content?.materials) ? content.materials : [],
  createdAt: content?.createdAt,
});
