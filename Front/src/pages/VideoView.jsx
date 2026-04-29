import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AuthService from "../services/AuthService";
import VideoStatsService from "../services/VideoStatsService";
import ForumService from "../services/ForumService";

export default function VideoView() {
  const location = useLocation();
  const tutorial = location.state || {};

  const title = tutorial.title || "Contenido sin titulo";
  const category = tutorial.category || "Sin categoria";
  const authorName = getUserName(tutorial.createdBy);
  const description = tutorial.description || "Este contenido aun no tiene descripcion registrada.";
  const currentUser = AuthService.getCurrentUser();
  const canReplyToQuestions = normalizeRole(currentUser?.role) !== "USER";
  const videoId = getYouTubeVideoId(tutorial.url);
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

  const accumulateWatchTime = ({ keepRunning = false } = {}) => {
    if (!lastStartedAtRef.current) return;

    const elapsed = Math.floor((Date.now() - lastStartedAtRef.current) / 1000);
    if (elapsed > 0) {
      pendingSecondsRef.current += elapsed;
    }

    lastStartedAtRef.current = keepRunning ? Date.now() : null;
  };

  const flushWatchTime = async () => {
    if (!tutorial.id) return;

    const seconds = pendingSecondsRef.current;
    if (seconds <= 0) return;

    pendingSecondsRef.current = 0;

    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser?.userId) return;

      await VideoStatsService.record({
        userId: currentUser.userId,
        contentId: tutorial.id,
        watchTimeSeconds: seconds,
        countView: false,
      });
    } catch (error) {
      pendingSecondsRef.current += seconds;
      console.error("Error registrando tiempo visto:", error);
    }
  };

  useEffect(() => {
    const recordInitialView = async () => {
      if (!tutorial.id || viewRecordedRef.current) return;

      try {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser?.userId) return;

        viewRecordedRef.current = true;
        await VideoStatsService.record({
          userId: currentUser.userId,
          contentId: tutorial.id,
          watchTimeSeconds: 0,
          countView: true,
        });
      } catch (error) {
        viewRecordedRef.current = false;
        console.error("Error registrando vista:", error);
      }
    };

    recordInitialView();
  }, [tutorial.id]);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!tutorial.id) return;

      setForumLoading(true);
      setForumError("");

      try {
        const data = await ForumService.getQuestionsByContent(tutorial.id);
        setQuestions(data);
      } catch (error) {
        console.error("Error cargando preguntas:", error);
        setForumError("No se pudieron cargar las preguntas de este contenido.");
      } finally {
        setForumLoading(false);
      }
    };

    loadQuestions();
  }, [tutorial.id]);

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
  }, [videoId, tutorial.id]);

  const createForumMessage = async (descriptionValue) => {
    try {
      if (!currentUser?.userId) {
        setForumError("Debes iniciar sesion para publicar una pregunta.");
        return null;
      }

      setForumError("");

      const created = await ForumService.createQuestion({
        contentId: tutorial.id,
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
    if (!descriptionValue || !tutorial.id) return;

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
    if (!replyValue || !tutorial.id) return null;

    try {
      setReplySubmittingId(question.id);
      return await createForumMessage(`Respuesta a ${getUserName(question.user)}: ${replyValue}`);
    } finally {
      setReplySubmittingId(null);
    }
  };

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      to="/admin/videos"
                      className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-base">arrow_back</span>
                      Volver a la biblioteca
                    </Link>
                    <h1 className="text-3xl font-black leading-tight tracking-tight text-[#0d141b] dark:text-white">
                      {title}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
                      <MetaBadge icon="category" label={category} />
                      <MetaBadge icon="person" label={`Subido por ${authorName}`} />
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
                  {videoId ? (
                    <div className="aspect-video w-full">
                      <div ref={playerContainerRef} className="h-full w-full" title={title} />
                    </div>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-surface-light p-8 text-center dark:bg-surface-dark">
                      <span className="material-symbols-outlined text-5xl text-primary">video_library</span>
                      <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        No se pudo cargar el video
                      </h2>
                      <p className="max-w-md text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        La URL registrada no parece ser un enlace valido de YouTube.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                  <h2 className="mb-4 text-xl font-bold text-[#0d141b] dark:text-white">
                    Sobre este contenido
                  </h2>
                  <p className="whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">
                    {description}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                      Dudas y Discusion
                    </h2>
                    <Link to="/foro" className="text-sm font-bold text-primary hover:underline">
                      Ver foro completo
                    </Link>
                  </div>

                  <form className="mt-6 flex gap-4" onSubmit={handleQuestionSubmit}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">edit_note</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        placeholder="Tienes alguna duda sobre este video? Pregunta aqui..."
                        rows="2"
                        value={questionText}
                        onChange={(event) => setQuestionText(event.target.value)}
                      />
                      {forumError && (
                        <p className="mt-2 text-sm font-medium text-red-500">{forumError}</p>
                      )}
                      <button
                        className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={forumSubmitting || !questionText.trim()}
                      >
                        {forumSubmitting ? "Enviando..." : "Enviar Pregunta"}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 flex flex-col gap-4">
                    {forumLoading ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">Cargando preguntas...</p>
                    ) : questions.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        Todavia no hay preguntas para este contenido. Se el primero en iniciar la conversacion.
                      </div>
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
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 flex flex-col gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <h3 className="mb-4 text-lg font-bold text-[#0d141b] dark:text-white">
                      Material de apoyo
                    </h3>
                    <div className="flex flex-col gap-3">
                      <SupportButton
                        icon="picture_as_pdf"
                        title="Checklist Renta 2024"
                        meta="PDF"
                        tone="red"
                      />
                      <SupportButton
                        icon="table_view"
                        title="Calculadora de Retenciones"
                        meta="EXCEL"
                        tone="blue"
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const MetaBadge = ({ icon, label }) => (
  <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
    <span className="material-symbols-outlined text-base text-primary">{icon}</span>
    <span className="truncate">{label}</span>
  </span>
);

const SupportButton = ({ icon, title, meta, tone }) => {
  const color =
    tone === "red"
      ? "bg-red-100 text-red-600 dark:bg-red-900/30"
      : "bg-blue-100 text-blue-600 dark:bg-blue-900/30";

  return (
    <button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{meta}</p>
      </div>
    </button>
  );
};

const QuestionItem = ({ question, canReply, isSubmittingReply, onReplySubmit }) => {
  const authorName = getUserName(question.user);
  const dateLabel = formatDate(question.createdAt);
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
    <article className={`rounded-xl border p-4 ${
      isStaffResponse
        ? "border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10"
        : "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[#0d141b] dark:text-white">{authorName}</p>
            {isStaffResponse && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                Respuesta del equipo
              </span>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">{dateLabel}</p>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
            {question.description}
          </p>
          {canReply && !isStaffResponse && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsReplyOpen((current) => !current)}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-base">reply</span>
                Responder
              </button>

              {isReplyOpen && (
                <form className="mt-3 flex flex-col gap-2" onSubmit={submitReply}>
                  <textarea
                    className="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    placeholder={`Responder a ${authorName}...`}
                    rows="2"
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyText("");
                        setIsReplyOpen(false);
                      }}
                      className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyText.trim()}
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingReply ? "Enviando..." : "Publicar respuesta"}
                    </button>
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

const getUserName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "Usuario";
};

const normalizeRole = (role) =>
  String(role || "USER")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getYouTubeVideoId = (url) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) {
        return parts[1] || null;
      }
    }
  } catch {
    const match = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  }

  return null;
};

let youtubeApiPromise;

const loadYouTubeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });

  return youtubeApiPromise;
};
