import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardSkeleton,
  CardHeader,
  EmptyState,
  Icon,
  Stat,
} from "../components/ui";
import AuthService from "../services/AuthService";
import CategoryService from "../services/CategoryService";
import ForumService from "../services/ForumService";
import VideoService from "../services/VideoService";
import { toContentState } from "../utils/content";
import { getYouTubeThumbnail } from "../utils/youtube";
import { isAdmin, normalizeRole, roleLabel, roleTone } from "../utils/role";

const RECENT_LIMIT = 6;

const greetingForHour = (hour) => {
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
};

/**
 * Inicio.
 *
 * Antes esta ruta renderizaba una barra lateral y un encabezado sobre un area
 * vacia: al iniciar sesion se llegaba a una pantalla en blanco. Ahora responde
 * lo primero que uno se pregunta al entrar — que hay, por donde empiezo y como
 * sigo — con datos reales de la API.
 */
export default function Main() {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const currentUserId = Number(currentUser?.userId);
  const currentRole = normalizeRole(currentUser?.role);
  const admin = isAdmin(currentRole);

  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      // allSettled: si el foro falla, el inicio sigue siendo util.
      const [videoResult, categoryResult, conversationResult] = await Promise.allSettled([
        VideoService.getAll(),
        CategoryService.getAll(),
        ForumService.getConversations(),
      ]);

      if (cancelled) return;

      if (videoResult.status === "fulfilled") {
        setVideos(Array.isArray(videoResult.value) ? videoResult.value : []);
      } else {
        console.error("Error cargando contenidos:", videoResult.reason);
        setError(
          videoResult.reason?.response?.data?.error ||
            videoResult.reason?.response?.data?.message ||
            "No se pudo cargar el contenido de la plataforma."
        );
      }

      if (categoryResult.status === "fulfilled") {
        setCategories(Array.isArray(categoryResult.value) ? categoryResult.value : []);
      }

      if (conversationResult.status === "fulfilled") {
        setConversations(Array.isArray(conversationResult.value) ? conversationResult.value : []);
      }

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const recentVideos = useMemo(
    () =>
      [...videos]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, RECENT_LIMIT),
    [videos]
  );

  const categorySummary = useMemo(
    () =>
      categories
        .map((category) => ({
          id: category.id,
          name: category.categoryName || category.name,
          count: videos.filter((video) => video.category?.categoryName === category.categoryName)
            .length,
        }))
        .filter((category) => category.name)
        .sort((a, b) => b.count - a.count),
    [categories, videos]
  );

  const myConversations = useMemo(() => {
    if (!currentUserId) return 0;

    return conversations.filter((conversation) =>
      (conversation.participantIds || []).some((id) => Number(id) === currentUserId)
    ).length;
  }, [conversations, currentUserId]);

  const quickActions = [
    {
      to: "/admin/videos",
      icon: "video_library",
      title: "Biblioteca de guías",
      description: "Explora los videos por categoría y sigue los pasos.",
    },
    {
      to: "/foro",
      icon: "forum",
      title: "Foro de ayuda",
      description: "Revisa las conversaciones abiertas o inicia una nueva.",
    },
    {
      to: "/profile",
      icon: "person",
      title: "Mi perfil",
      description: "Actualiza tus datos y tu foto de perfil.",
    },
    ...(admin
      ? [
          {
            to: "/admin/dashboard",
            icon: "dashboard",
            title: "Panel administrativo",
            description: "Métricas de uso y gestión de la plataforma.",
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Bienvenida */}
      <Card className="overflow-hidden" padded={false}>
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar name={currentUser?.email} size="lg" />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg-muted">
                {greetingForHour(new Date().getHours())}
              </p>
              <h1 className="mt-0.5 truncate text-xl font-extrabold text-fg sm:text-2xl">
                {currentUser?.email || "Bienvenido"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone={roleTone(currentRole)} icon="verified_user">
                  {roleLabel(currentRole)}
                </Badge>
                <Badge tone="neutral" icon="video_library">
                  {videos.length} {videos.length === 1 ? "contenido" : "contenidos"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button to="/admin/videos" icon="play_circle">
              Explorar la biblioteca
            </Button>
            <Button to="/foro" variant="outline" icon="forum">
              Ir al foro
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="No se pudo cargar todo el contenido"
          action={
            <Button variant="outline" size="sm" onClick={() => navigate(0)}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Cifras */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat icon="video_library" label="Contenidos disponibles" value={videos.length} tone="brand" />
        <Stat icon="category" label="Categorías activas" value={categories.length} tone="success" />
        <Stat
          icon="forum"
          label="Conversaciones donde participas"
          value={myConversations}
          tone="warning"
        />
      </section>

      {/* Accesos rápidos */}
      <section>
        <h2 className="mb-4 text-lg font-extrabold text-fg">¿Qué quieres hacer?</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-pop"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                <Icon name={action.icon} size={20} />
              </span>
              <span className="text-sm font-bold text-fg">{action.title}</span>
              <span className="text-xs leading-5 text-fg-muted">{action.description}</span>
              <span className="mt-auto flex items-center gap-1 pt-2 text-xs font-bold text-brand-ink">
                Entrar
                <Icon name="arrow_forward" size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categorías */}
      {categorySummary.length > 0 && (
        <Card padded={false}>
          <div className="p-6">
            <CardHeader
              icon="category"
              title="Explora por categoría"
              subtitle="Filtra la biblioteca por el tipo de trámite."
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {categorySummary.map((category) => (
                <Link
                  key={category.id ?? category.name}
                  to={`/admin/videos?cat=${encodeURIComponent(category.name)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-fg-muted transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-ink"
                >
                  {category.name}
                  <span className="rounded-full bg-subtle px-2 py-0.5 text-[11px] font-bold">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Contenido reciente */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-fg">Agregado recientemente</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Los últimos contenidos publicados en la plataforma.
            </p>
          </div>

          <Button variant="ghost" size="sm" to="/admin/videos" iconRight="arrow_forward">
            Ver todo
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : recentVideos.length === 0 ? (
          <EmptyState
            icon="video_library"
            title="Todavía no hay contenidos publicados"
            description={
              admin
                ? "Crea el primer contenido desde la biblioteca para que aparezca aquí."
                : "Cuando tu docente publique contenidos, los verás en esta sección."
            }
            action={
              admin ? (
                <Button to="/admin/videos" icon="add">
                  Agregar contenido
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recentVideos.map((video) => (
              <Link
                key={video.id}
                to="/video"
                state={toContentState(video)}
                className="block h-full rounded-xl focus:outline-none"
              >
                <VideoCard
                  title={video.title}
                  category={video.category?.categoryName || "Sin categoría"}
                  imageUrl={getYouTubeThumbnail(video.urlVideo)}
                  description={video.description}
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
