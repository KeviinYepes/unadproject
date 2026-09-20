import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryTreeFilter from "../components/CategoryTreeFilter";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";
import VideoCard from "../components/VideoCard";
import {
  Alert,
  Button,
  CardSkeleton,
  EmptyState,
  Icon,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
} from "../components/ui";
import AuthService from "../services/AuthService";
import CategoryService from "../services/CategoryService";
import VideoService from "../services/VideoService";
import VideoStatsService from "../services/VideoStatsService";
import { toContentState } from "../utils/content";
import { formatDuration } from "../utils/format";
import {
  ACCEPTED_MATERIAL_TYPES,
  getFirstImageMaterialUrl,
  getMaterialFormat,
  getMaterialFormatsSummary,
} from "../utils/materialFormats";
import { normalizeRole } from "../utils/role";
import { getYouTubeDuration, getYouTubeVideoId } from "../utils/youtube";

const PAGE_SIZE = 12;

const emptyForm = { title: "", categoryId: "", description: "", urlVideo: "", materials: [] };

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

export default function VideosLibrary() {
  const currentUser = AuthService.getCurrentUser();
  const canManageContent = ["ADMIN", "MODERATOR"].includes(normalizeRole(currentUser?.role));

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [durations, setDurations] = useState({});
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const loadDurations = async () => {
      const entries = videos
        .map((video) => {
          const videoId = getYouTubeVideoId(video.urlVideo);
          return videoId ? { key: video.id, videoId } : null;
        })
        .filter(Boolean)
        .filter(({ key }) => !durations[key]);

      if (entries.length === 0) return;

      const results = await Promise.all(
        entries.map(async ({ key, videoId }) => [key, formatDuration(await getYouTubeDuration(videoId))])
      );

      setDurations((prev) => ({
        ...prev,
        ...Object.fromEntries(results.filter(([, value]) => value)),
      }));
    };

    loadDurations();
  }, [videos, durations]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [contentData, categoryData, statsData] = await Promise.all([
        VideoService.getAll(),
        CategoryService.getAll(),
        VideoStatsService.getViewsByContent(),
      ]);

      setVideos(Array.isArray(contentData) ? contentData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setStats(Array.isArray(statsData) ? statsData : []);
      setError("");
    } catch (e) {
      console.error("Error cargando contenido:", e);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        e.message ||
        "Error al cargar contenido";
      setError(msg);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, materials: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!form.urlVideo.trim() && form.materials.length === 0) {
        throw new Error("Agrega una URL de video o al menos un material de apoyo.");
      }

      const user = AuthService.getCurrentUser();
      if (!user?.userId) {
        throw new Error("No se encontró el usuario actual. Vuelve a iniciar sesión.");
      }

      await VideoService.create({
        title: form.title,
        urlVideo: form.urlVideo,
        categoryId: form.categoryId,
        description: form.description || null,
        createdById: user.userId,
        materials: form.materials,
      });

      showToast("Contenido agregado correctamente.");
      handleCloseModal();
      await cargarDatos();
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.error || err.response?.data?.message;
      const message = apiMessage || err.message || "Error al guardar el contenido";
      setError(message);
      showToast(`Error al guardar el contenido: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  };

  const viewsByContentId = useMemo(() => {
    const map = new Map();
    stats.forEach((stat) => {
      map.set(Number(stat.contentId), Number(stat.totalViews || 0));
    });
    return map;
  }, [stats]);

  const toCardItem = (video) => {
    const hasVideoUrl = Boolean(String(video.urlVideo || "").trim());
    const isMaterialOnly = !hasVideoUrl && (video.materials || []).length > 0;
    const materialSummary = getMaterialFormatsSummary(video.materials || []);
    const imageMaterialUrl = getFirstImageMaterialUrl(video.materials || []);

    return {
      ...toContentState(video),
      duration: isMaterialOnly
        ? materialSummary || "Material"
        : [durations[video.id] || "...", materialSummary].filter(Boolean).join(" | "),
      imageUrl: imageMaterialUrl || getYouTubeThumbnail(video.urlVideo),
      isMaterialOnly,
      views: viewsByContentId.get(Number(video.id)) || 0,
    };
  };

  const items = useMemo(() => videos.map(toCardItem), [videos, durations, viewsByContentId]);

  const filteredTutorials = useMemo(() => {
    const q = normalizeText(searchQuery);
    const selected = normalizeText(selectedCategory);

    const filtered = items.filter((tutorial) => {
      const haystack = `${normalizeText(tutorial.title)} ${normalizeText(tutorial.category)}`;
      const matchesSearch = !q || haystack.includes(q);
      const matchesCategory = !selected || normalizeText(tutorial.category) === selected;
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return String(a.title).localeCompare(String(b.title), "es", { sensitivity: "base" });
      }

      if (sortBy === "category") {
        return String(a.category).localeCompare(String(b.category), "es", { sensitivity: "base" });
      }

      if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [searchQuery, selectedCategory, sortBy, items]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const paginatedTutorials = useMemo(
    () => paginate(filteredTutorials, currentPage, PAGE_SIZE),
    [filteredTutorials, currentPage]
  );

  return (
    <div className="flex flex-col gap-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <PageHeader
        eyebrow="Aprendizaje"
        title="Biblioteca de guías visuales"
        description="Selecciona un formulario para ver el video instructivo y seguir los pasos."
        actions={
          canManageContent && (
            <Button icon="add" onClick={handleOpenCreate} disabled={loading}>
              Agregar contenido
            </Button>
          )
        }
      />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar contenido..."
            aria-label="Buscar contenido"
            className="h-10 w-full rounded-lg border border-line bg-surface pl-10 pr-3 text-sm text-fg transition-colors placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>

        <Select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Ordenar contenidos"
          wrapperClassName="w-full sm:w-56"
          className="h-10 py-0"
        >
          <option value="recent">Ordenar por: Recientes</option>
          <option value="views">Ordenar por: Más vistos</option>
          <option value="title">Ordenar por: Título</option>
          <option value="category">Ordenar por: Categoría</option>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CategoryTreeFilter
          categories={categories}
          videos={items}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="min-w-0">
          {loading && filteredTutorials.length === 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : !error && videos.length === 0 ? (
            <EmptyState
              icon="video_library"
              title="No hay contenido registrado"
              description="Agrega tu primer contenido para que aparezca en la biblioteca de guías visuales."
              action={
                canManageContent ? (
                  <Button icon="add" onClick={handleOpenCreate}>
                    Agregar contenido
                  </Button>
                ) : null
              }
            />
          ) : filteredTutorials.length === 0 ? (
            <EmptyState icon="search_off" title="Sin resultados" description="No hay contenido que coincida con la búsqueda." />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {paginatedTutorials.map((tutorial, index) => (
                <Link
                  key={tutorial.id ?? index}
                  to="/video"
                  state={tutorial}
                  className="group block h-full rounded-xl focus:outline-none"
                >
                  <VideoCard
                    title={tutorial.title}
                    category={tutorial.category}
                    duration={tutorial.duration}
                    imageUrl={tutorial.imageUrl}
                    description={tutorial.description}
                    isMaterialOnly={tutorial.isMaterialOnly}
                    materials={tutorial.materials}
                  />
                  <div className="mt-2 flex items-center gap-1 text-sm font-bold text-brand-ink opacity-0 transition-opacity group-hover:opacity-100">
                    <Icon
                      name={tutorial.isMaterialOnly ? getMaterialFormat(tutorial.materials[0]).icon : "play_circle"}
                      size={16}
                    />
                    {tutorial.isMaterialOnly ? "Ver material de apoyo" : "Ver paso a paso"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Pagination
        page={currentPage}
        totalItems={filteredTutorials.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        itemLabel="contenidos"
      />

      {/* Alta de contenido */}
      <Modal
        open={canManageContent && isModalOpen}
        onClose={handleCloseModal}
        dismissible={!loading}
        size="lg"
        icon="add_to_queue"
        title="Agregar contenido multimedia"
        subtitle="Completa la información del contenido. Puedes registrar archivos de apoyo aunque no haya video."
        footer={
          <>
            <Button variant="outline" onClick={handleCloseModal} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" form="create-content-form" icon="save" loading={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <form id="create-content-form" onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2" noValidate>
          <Input
            label="Título"
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <Select
            label="Categoría"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Seleccionar...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </Select>

          <Textarea
            label="Descripción"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            wrapperClassName="md:col-span-2"
          />

          <Input
            label="URL del video"
            name="urlVideo"
            placeholder="https://..."
            value={form.urlVideo}
            onChange={handleChange}
            disabled={loading}
            wrapperClassName="md:col-span-2"
          />

          <MaterialFileInput
            label="Materiales de apoyo"
            files={form.materials}
            onChange={handleFileChange}
            disabled={loading}
            className="md:col-span-2"
          />
        </form>
      </Modal>
    </div>
  );
}

/* ============================== subcomponentes ============================== */

const MaterialFileInput = ({ label, files = [], disabled = false, className = "", onChange }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-[13px] font-semibold text-fg">{label}</span>

    <label
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm font-semibold transition-colors ${
        disabled
          ? "cursor-not-allowed border-line bg-subtle text-fg-subtle"
          : "border-brand/40 bg-brand-soft/60 text-brand-ink hover:border-brand hover:bg-brand-soft"
      }`}
    >
      <Icon name="upload_file" size={18} />
      Seleccionar archivos
      <input
        type="file"
        accept={ACCEPTED_MATERIAL_TYPES}
        multiple
        disabled={disabled}
        className="hidden"
        onChange={onChange}
      />
    </label>

    <p className="text-xs text-fg-subtle">Formatos permitidos: PDF, Word, Excel, JPG, PNG y WEBP.</p>

    {files.length > 0 && (
      <ul className="flex flex-wrap gap-2">
        {files.map((file) => {
          const format = getMaterialFormat(file);
          return (
            <li
              key={`${file.name}-${file.size}`}
              title={file.name}
              className={`inline-flex max-w-full items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold sm:max-w-xs ${format.tone}`}
            >
              <Icon name={format.icon} size={14} className="shrink-0" />
              <span className="shrink-0 font-black">{format.label}</span>
              <span className="min-w-0 truncate">{file.name}</span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};
