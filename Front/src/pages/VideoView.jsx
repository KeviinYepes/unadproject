import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ContentThumbnail from "../components/ContentThumbnail";
import AuthService from "../services/AuthService";
import VideoStatsService from "../services/VideoStatsService";
import ForumService from "../services/ForumService";
import VideoService from "../services/VideoService";
import CategoryService from "../services/CategoryService";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  Icon,
  Input,
  Modal,
  Select,
  Textarea,
} from "../components/ui";
import { getCategoryLabel, getContentUrl } from "../utils/content";
import { formatDateTime, formatFileSize, getUserName } from "../utils/format";
import { normalizeRole } from "../utils/role";
import { getYouTubeVideoId, loadYouTubeApi } from "../utils/youtube";
import {
  ACCEPTED_MATERIAL_TYPES,
  getFirstImageMaterialUrl,
  getMaterialFormat,
  getMaterialUrl,
} from "../utils/materialFormats";

export default function VideoView() {
  const location = useLocation();
  const navigate = useNavigate();
  const tutorial = location.state || {};
  const [content, setContent] = useState(tutorial);

  const title = content.title || "Contenido sin título";
  const category = getCategoryLabel(content.category);
  const authorName = getUserName(content.createdBy);
  const description = content.description || "Este contenido aún no tiene descripción registrada.";
  const materials = Array.isArray(content.materials) ? content.materials : [];
  const currentUser = AuthService.getCurrentUser();
  const currentRole = normalizeRole(currentUser?.role);
  const canReplyToQuestions = currentRole !== "USER";
  const canManageMaterials = currentRole !== "USER";
  const canEditContent = ["ADMIN", "MODERATOR"].includes(currentRole);
  const canDeleteContent = currentRole === "ADMIN";
  const contentUrl = getContentUrl(content);
  const hasVideoUrl = Boolean(contentUrl.trim());
  const videoId = getYouTubeVideoId(contentUrl);
  const imageMaterialUrl = getFirstImageMaterialUrl(materials);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const lastStartedAtRef = useRef(null);
  const pendingSecondsRef = useRef(0);
  const viewRecordedRef = useRef(false);

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [forumLoading, setForumLoading] = useState(false);
  const [forumSubmitting, setForumSubmitting] = useState(false);
  const [replySubmittingId, setReplySubmittingId] = useState(null);
  const [forumError, setForumError] = useState("");
  const [materialFiles, setMaterialFiles] = useState([]);
  const [materialSubmitting, setMaterialSubmitting] = useState(false);
  const [deletingMaterialId, setDeletingMaterialId] = useState(null);
  const [materialError, setMaterialError] = useState("");
  const [contentDeleting, setContentDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentError, setContentError] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    categoryId: "",
    description: "",
    urlVideo: "",
  });

  const accumulateWatchTime = ({ keepRunning = false } = {}) => {
    if (!lastStartedAtRef.current) return;

    const elapsed = Math.floor((Date.now() - lastStartedAtRef.current) / 1000);
    if (elapsed > 0) {
      pendingSecondsRef.current += elapsed;
    }

    lastStartedAtRef.current = keepRunning ? Date.now() : null;
  };

  const flushWatchTime = async () => {
    if (!content.id) return;

    const seconds = pendingSecondsRef.current;
    if (seconds <= 0) return;

    pendingSecondsRef.current = 0;

    try {
      const user = AuthService.getCurrentUser();
      if (!user?.userId) return;

      await VideoStatsService.record({
        userId: user.userId,
        contentId: content.id,
        watchTimeSeconds: seconds,
        countView: false,
      });
    } catch (error) {
      pendingSecondsRef.current += seconds;
      console.error("Error registrando tiempo visto:", error);
    }
  };

  useEffect(() => {
    const loadFullContent = async () => {
      if (!tutorial.id) return;

      try {
        const fullContent = await VideoService.getById(tutorial.id);
        setContent(fullContent);
      } catch (error) {
        console.error("Error cargando el detalle del contenido:", error);
      }
    };

    loadFullContent();
  }, [tutorial.id]);

  useEffect(() => {
    const recordInitialView = async () => {
      if (!content.id || viewRecordedRef.current) return;

      try {
        const user = AuthService.getCurrentUser();
        if (!user?.userId) return;

        viewRecordedRef.current = true;
        await VideoStatsService.record({
          userId: user.userId,
          contentId: content.id,
          watchTimeSeconds: 0,
          countView: true,
        });
      } catch (error) {
        viewRecordedRef.current = false;
        console.error("Error registrando vista:", error);
      }
    };

    recordInitialView();
  }, [content.id]);

  useEffect(() => {
    if (!canEditContent) return;

    const loadCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando categorias:", error);
      }
    };

    loadCategories();
  }, [canEditContent]);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!content.id) return;

      setForumLoading(true);
      setForumError("");

      try {
        const data = await ForumService.getQuestionsByContent(content.id);
        setQuestions(data);
      } catch (error) {
        console.error("Error cargando preguntas:", error);
        setForumError("No se pudieron cargar las preguntas de este contenido.");
      } finally {
        setForumLoading(false);
      }
    };

    loadQuestions();
  }, [content.id]);

  useEffect(() => {
    if (!videoId || !playerContainerRef.current) return;

    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !playerContainerRef.current) return;

      playerRef.current = new YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              isPlayingRef.current = true;
              lastStartedAtRef.current = Date.now();
            } else if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED ||
              event.data === YT.PlayerState.BUFFERING
            ) {
              accumulateWatchTime();
              isPlayingRef.current = false;
              flushWatchTime();
            }
          },
        },
      });
    });

    const interval = setInterval(() => {
      if (!isPlayingRef.current) return;
      accumulateWatchTime({ keepRunning: true });
      flushWatchTime();
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        accumulateWatchTime();
        isPlayingRef.current = false;
        flushWatchTime();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      accumulateWatchTime();
      isPlayingRef.current = false;
      flushWatchTime();
      playerRef.current?.destroy?.();
    };
  }, [videoId, content.id]);

  const createForumMessage = async (descriptionValue) => {
    try {
      if (!currentUser?.userId) {
        setForumError("Debes iniciar sesion para publicar una pregunta.");
        return null;
      }

      setForumError("");

      const created = await ForumService.createQuestion({
        contentId: content.id,
        userId: currentUser.userId,
        title: `Dudas sobre ${title}`,
        description: descriptionValue,
      });

      setQuestions((currentQuestions) => [...currentQuestions, created]);
      return created;
    } catch (error) {
      console.error("Error publicando mensaje:", error);
      setForumError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo publicar el mensaje."
      );
      return null;
    }
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();

    const descriptionValue = questionText.trim();
    if (!descriptionValue || !content.id) return;

    try {
      setForumSubmitting(true);
      const created = await createForumMessage(descriptionValue);
      if (created) {
        setQuestionText("");
      }
    } finally {
      setForumSubmitting(false);
    }
  };

  const handleReplySubmit = async (question, replyText) => {
    const replyValue = replyText.trim();
    if (!replyValue || !content.id) return null;

    try {
      setReplySubmittingId(question.id);
      return await createForumMessage(`Respuesta a ${getUserName(question.user)}: ${replyValue}`);
    } finally {
      setReplySubmittingId(null);
    }
  };

  const handleMaterialSubmit = async (event) => {
    event.preventDefault();

    if (!content.id || materialFiles.length === 0) return;

    try {
      setMaterialSubmitting(true);
      setMaterialError("");
      const updated = await VideoService.addMaterials(content.id, materialFiles);
      setContent((current) => ({
        ...current,
        ...updated,
        category: getCategoryLabel(updated.category ?? current.category),
        url: getContentUrl(updated) || getContentUrl(current),
        materials: Array.isArray(updated.materials) ? updated.materials : current.materials,
      }));
      setMaterialFiles([]);
    } catch (error) {
      console.error("Error subiendo materiales:", error);
      setMaterialError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudieron subir los materiales."
      );
    } finally {
      setMaterialSubmitting(false);
    }
  };

  const handleMaterialDelete = async (material) => {
    if (!content.id || !material?.id) return;

    try {
      setDeletingMaterialId(material.id);
      setMaterialError("");
      const updated = await VideoService.deleteMaterial(content.id, material.id);
      setContent((current) => ({
        ...current,
        ...updated,
        category: getCategoryLabel(updated.category ?? current.category),
        url: getContentUrl(updated) || getContentUrl(current),
        materials: Array.isArray(updated.materials)
          ? updated.materials
          : current.materials.filter((item) => item.id !== material.id),
      }));
    } catch (error) {
      console.error("Error eliminando material:", error);
      setMaterialError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo eliminar el material."
      );
    } finally {
      setDeletingMaterialId(null);
    }
  };

  const handleContentDelete = async () => {
    if (!content.id || contentDeleting) return;

    try {
      setContentDeleting(true);
      await VideoService.delete(content.id);
      navigate("/admin/biblioteca", { replace: true });
    } catch (error) {
      console.error("Error eliminando contenido:", error);
      setMaterialError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo eliminar el contenido."
      );
      setContentDeleting(false);
    }
  };

  const openEditModal = () => {
    const currentCategoryId =
      content.category?.id ||
      categories.find((item) => getCategoryLabel(item) === getCategoryLabel(content.category))?.id ||
      "";

    setEditForm({
      title: content.title || "",
      categoryId: currentCategoryId ? String(currentCategoryId) : "",
      description: content.description || "",
      urlVideo: content.urlVideo || getContentUrl(content) || "",
    });
    setContentError("");
    setIsEditModalOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
    setContentError("");
  };

  const handleContentUpdate = async (event) => {
    event.preventDefault();
    if (!content.id || contentSaving) return;

    try {
      if (!editForm.urlVideo.trim() && materials.length === 0) {
        throw new Error("Agrega una URL de video o conserva al menos un material de apoyo.");
      }

      setContentSaving(true);
      setContentError("");

      const updated = await VideoService.update(content.id, {
        ...editForm,
        createdById: content.createdBy?.id || currentUser?.userId,
      });

      setContent((current) => ({
        ...current,
        ...updated,
        url: getContentUrl(updated) || editForm.urlVideo,
        materials: Array.isArray(updated.materials) ? updated.materials : current.materials,
      }));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error actualizando contenido:", error);
      setContentError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo actualizar el contenido."
      );
    } finally {
      setContentSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            to="/admin/biblioteca"
            className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-brand-ink hover:underline"
          >
            <Icon name="arrow_back" size={16} />
            Volver a la biblioteca
          </Link>

          <h1 className="text-2xl font-extrabold leading-tight text-fg sm:text-[28px]">{title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="brand" icon="category">
              {category}
            </Badge>
            <Badge tone="neutral" icon="person">
              {`Subido por ${authorName}`}
            </Badge>
          </div>
        </div>

        {(canEditContent || canDeleteContent) && (
          <div className="flex flex-wrap gap-2">
            {canEditContent && (
              <Button
                variant="outline"
                icon="edit"
                onClick={openEditModal}
                disabled={contentDeleting || contentSaving}
              >
                Editar contenido
              </Button>
            )}

            {canDeleteContent && (
              <Button
                variant="dangerSoft"
                icon="delete"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={contentDeleting}
              >
                {contentDeleting ? "Eliminando..." : "Eliminar contenido"}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Reproductor / material principal */}
          <div className="overflow-hidden rounded-xl border border-line bg-black shadow-card">
            {videoId ? (
              <div className="aspect-video w-full">
                <div ref={playerContainerRef} className="size-full" title={title} />
              </div>
            ) : !hasVideoUrl ? (
              <div className="aspect-video w-full">
                <ContentThumbnail
                  title={title}
                  imageUrl={imageMaterialUrl}
                  materials={materials}
                  isMaterialOnly
                />
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-subtle p-8 text-center">
                <Icon name="videocam_off" size={40} className="text-fg-subtle" />
                <h2 className="text-base font-bold text-fg">No se pudo cargar el video</h2>
                <p className="max-w-md text-sm text-fg-muted">
                  La URL registrada no parece ser un enlace válido de YouTube.
                </p>
              </div>
            )}
          </div>

          {/* Descripcion */}
          <Card>
            <CardHeader icon="description" title="Sobre este contenido" />
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-fg-muted">{description}</p>
          </Card>

          {/* Dudas y discusion */}
          <Card>
            <CardHeader
              icon="forum"
              title="Dudas y discusión"
              subtitle={
                questions.length > 0
                  ? `${questions.length} ${questions.length === 1 ? "mensaje" : "mensajes"} en esta conversación`
                  : "Sé el primero en preguntar"
              }
              action={
                <Button variant="ghost" size="sm" to="/foro" iconRight="arrow_forward">
                  Ver foro completo
                </Button>
              }
            />

            <form onSubmit={handleQuestionSubmit} className="mt-5 flex items-start gap-3">
              <Avatar name={currentUser?.email} size="sm" />
              <div className="min-w-0 flex-1">
                <Textarea
                  aria-label="Tu pregunta"
                  rows={2}
                  placeholder="¿Tienes alguna duda sobre este video? Pregúntala aquí..."
                  value={questionText}
                  onChange={(event) => setQuestionText(event.target.value)}
                />
                {forumError && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
                    <Icon name="error" size={14} />
                    {forumError}
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    icon="send"
                    loading={forumSubmitting}
                    disabled={!questionText.trim()}
                  >
                    {forumSubmitting ? "Enviando..." : "Enviar pregunta"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-3">
              {forumLoading ? (
                <p className="py-4 text-sm text-fg-muted">Cargando preguntas...</p>
              ) : questions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line px-4 py-5 text-center text-sm text-fg-muted">
                  Todavía no hay preguntas para este contenido. Sé el primero en iniciar la conversación.
                </p>
              ) : (
                questions.map((question) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    canReply={canReplyToQuestions}
                    isSubmittingReply={replySubmittingId === question.id}
                    onReplySubmit={handleReplySubmit}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Material de apoyo */}
        <aside className="lg:col-span-1">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <Card>
              <CardHeader
                icon="folder_open"
                title="Material de apoyo"
                subtitle={
                  materials.length > 0
                    ? `${materials.length} ${materials.length === 1 ? "archivo" : "archivos"}`
                    : "Sin archivos adjuntos"
                }
              />

              {canManageMaterials && (
                <form onSubmit={handleMaterialSubmit} className="mt-4 flex flex-col gap-3">
                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-3 text-sm font-semibold transition-colors ${
                      materialSubmitting
                        ? "cursor-not-allowed border-line bg-subtle text-fg-subtle"
                        : "border-brand/40 bg-brand-soft/60 text-brand-ink hover:border-brand hover:bg-brand-soft"
                    }`}
                  >
                    <Icon name="upload_file" size={18} />
                    Seleccionar archivo
                    <input
                      type="file"
                      accept={ACCEPTED_MATERIAL_TYPES}
                      multiple
                      className="hidden"
                      disabled={materialSubmitting}
                      onChange={(event) => setMaterialFiles(Array.from(event.target.files || []))}
                    />
                  </label>

                  {materialFiles.length > 0 && (
                    <ul className="flex flex-col gap-1.5">
                      {materialFiles.map((file) => {
                        const format = getMaterialFormat(file);
                        return (
                          <li
                            key={`${file.name}-${file.size}`}
                            title={file.name}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${format.tone}`}
                          >
                            <Icon name={format.icon} size={14} className="shrink-0" />
                            <span className="shrink-0 font-black">{format.label}</span>
                            <span className="min-w-0 truncate">{file.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {materialError && (
                    <p className="flex items-start gap-1 text-xs font-medium text-danger">
                      <Icon name="error" size={14} className="mt-0.5 shrink-0" />
                      {materialError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="sm"
                    icon="cloud_upload"
                    loading={materialSubmitting}
                    disabled={materialFiles.length === 0}
                  >
                    {materialSubmitting ? "Subiendo..." : "Subir material"}
                  </Button>
                </form>
              )}

              <div className="mt-5 flex flex-col gap-2">
                {materials.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-line px-4 py-5 text-center text-sm text-fg-muted">
                    Este contenido no tiene materiales de apoyo asociados.
                  </p>
                ) : (
                  materials.map((material) => (
                    <SupportFile
                      key={material.id || material.driveFileId}
                      material={material}
                      title={material.fileName || "Material de apoyo"}
                      meta={formatFileSize(material.sizeBytes)}
                      href={getMaterialUrl(material)}
                      canDelete={canManageMaterials}
                      isDeleting={deletingMaterialId === material.id}
                      onDelete={() => setMaterialToDelete(material)}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>
        </aside>
      </div>

      {/* Editar contenido */}
      <Modal
        open={isEditModalOpen}
        onClose={() => {
          if (!contentSaving) setIsEditModalOpen(false);
        }}
        dismissible={!contentSaving}
        size="lg"
        icon="edit"
        title="Editar contenido"
        subtitle="Actualiza la información principal del video."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={contentSaving}>
              Cancelar
            </Button>
            <Button type="submit" form="edit-content-form" icon="save" loading={contentSaving}>
              {contentSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </>
        }
      >
        <form id="edit-content-form" onSubmit={handleContentUpdate} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Título"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            disabled={contentSaving}
            required
          />

          <Select
            label="Categoría"
            name="categoryId"
            value={editForm.categoryId}
            onChange={handleEditChange}
            disabled={contentSaving}
            required
          >
            <option value="">Seleccionar...</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.categoryName}
              </option>
            ))}
          </Select>

          <Input
            label="URL del video"
            name="urlVideo"
            placeholder="https://..."
            value={editForm.urlVideo}
            onChange={handleEditChange}
            disabled={contentSaving}
            wrapperClassName="md:col-span-2"
          />

          <Textarea
            label="Descripción"
            name="description"
            rows={4}
            value={editForm.description}
            onChange={handleEditChange}
            disabled={contentSaving}
            wrapperClassName="md:col-span-2"
          />

          {contentError && (
            <div className="md:col-span-2">
              <Alert tone="danger">{contentError}</Alert>
            </div>
          )}
        </form>
      </Modal>

      {/* Eliminar contenido */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        dismissible={!contentDeleting}
        size="sm"
        icon="delete_forever"
        title="Eliminar contenido"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={contentDeleting}>
              Cancelar
            </Button>
            <Button variant="danger" icon="delete" loading={contentDeleting} onClick={handleContentDelete}>
              {contentDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-fg-muted">
          Esta acción eliminará <span className="font-bold text-fg">{title}</span>, sus materiales de apoyo,
          estadísticas e hilos de conversación. Esta acción no se puede deshacer.
        </p>
      </Modal>

      {/* Eliminar material */}
      <Modal
        open={Boolean(materialToDelete)}
        onClose={() => setMaterialToDelete(null)}
        dismissible={!deletingMaterialId}
        size="sm"
        icon={materialToDelete ? getMaterialFormat(materialToDelete).icon : "delete_forever"}
        title="Eliminar material"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setMaterialToDelete(null)}
              disabled={Boolean(deletingMaterialId)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              icon="delete"
              loading={Boolean(deletingMaterialId)}
              onClick={async () => {
                await handleMaterialDelete(materialToDelete);
                setMaterialToDelete(null);
              }}
            >
              {deletingMaterialId ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-fg-muted">
          Este archivo se eliminará del contenido y también se borrará del almacenamiento local.
        </p>
        <p className="mt-3 break-words rounded-lg bg-subtle px-3 py-2 text-sm font-semibold text-fg [overflow-wrap:anywhere]">
          {materialToDelete?.fileName || "Material de apoyo"}
        </p>
      </Modal>
    </div>
  );
}

/* ============================== subcomponentes ============================== */

const SupportFile = ({ material, title, meta, href, canDelete = false, isDeleting = false, onDelete }) => {
  const format = getMaterialFormat(material);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-line p-2.5 transition-colors hover:bg-subtle/60">
      <a className="flex min-w-0 flex-1 items-center gap-3" href={href} target="_blank" rel="noreferrer">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${format.tone}`}>
          <Icon name={format.icon} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block break-words text-[13px] font-bold leading-5 [overflow-wrap:anywhere]">
            {title}
          </span>
          <span className="flex flex-wrap items-center gap-1 text-[10px] font-black uppercase tracking-wider text-fg-subtle">
            <span className={`rounded px-1.5 py-0.5 ${format.tone}`}>{format.label}</span>
            <span>{meta}</span>
          </span>
        </span>
      </a>

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={`Eliminar ${title}`}
          title="Eliminar material"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name={isDeleting ? "hourglass_empty" : "delete"} size={18} />
        </button>
      )}
    </div>
  );
};

const QuestionItem = ({ question, canReply, isSubmittingReply, onReplySubmit }) => {
  const authorName = getUserName(question.user);
  const dateLabel = formatDateTime(question.createdAt);
  const authorRole = normalizeRole(question.user?.role?.roleName);
  const isStaffResponse = authorRole && authorRole !== "USER";
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const submitReply = async (event) => {
    event.preventDefault();

    const created = await onReplySubmit(question, replyText);
    if (created) {
      setReplyText("");
      setIsReplyOpen(false);
    }
  };

  return (
    <article
      className={`rounded-xl border p-4 ${
        isStaffResponse ? "border-brand/25 bg-brand-soft/50" : "border-line bg-subtle/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={authorName} size="sm" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-fg">{authorName}</p>
            {isStaffResponse && (
              <Badge tone="brand" size="sm" icon="verified">
                Respuesta del equipo
              </Badge>
            )}
            <p className="text-xs text-fg-subtle">{dateLabel}</p>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-fg-muted">{question.description}</p>
          {canReply && !isStaffResponse && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsReplyOpen((current) => !current)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-ink hover:underline"
              >
                <Icon name="reply" size={16} />
                Responder
              </button>

              {isReplyOpen && (
                <form className="mt-3 flex flex-col gap-2" onSubmit={submitReply}>
                  <Textarea
                    aria-label={`Responder a ${authorName}`}
                    rows={2}
                    placeholder={`Responder a ${authorName}...`}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setReplyText("");
                        setIsReplyOpen(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      icon="send"
                      loading={isSubmittingReply}
                      disabled={!replyText.trim()}
                    >
                      {isSubmittingReply ? "Enviando..." : "Publicar respuesta"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
