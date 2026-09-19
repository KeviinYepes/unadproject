import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SegmentedControl from "../components/SegmentedControl";
import ForumService from "../services/ForumService";
import AuthService from "../services/AuthService";
import { isWithinDateRange, resolvePeriodPresetRange } from "../utils/periodFilters";

export default function Forum() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodPreset, setPeriodPreset] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [contentId, setContentId] = useState("");
  const [userId, setUserId] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const currentUserId = Number(currentUser?.userId);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await ForumService.getConversations();
        setConversations(data);
      } catch (requestError) {
        console.error("Error cargando conversaciones:", requestError);
        setError("No se pudieron cargar las conversaciones del foro.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const categoryOptions = useMemo(() => buildCategoryOptions(conversations), [conversations]);
  const contentOptions = useMemo(
    () => buildContentOptions(conversations, categoryId),
    [conversations, categoryId]
  );
  const userOptions = useMemo(() => buildUserOptions(conversations), [conversations]);

  const applyPeriodPreset = (preset) => {
    setPeriodPreset(preset);
    const { dateFrom: nextFrom, dateTo: nextTo } = resolvePeriodPresetRange(preset);
    setDateFrom(nextFrom);
    setDateTo(nextTo);
  };

  const handleManualDateChange = (setter) => (event) => {
    setter(event.target.value);
    setPeriodPreset("custom");
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    setContentId("");
  };

  const hasActiveFilters = periodPreset !== "all" || Boolean(categoryId) || Boolean(contentId) || Boolean(userId);

  const clearAllFilters = () => {
    setPeriodPreset("all");
    setDateFrom("");
    setDateTo("");
    setCategoryId("");
    setContentId("");
    setUserId("");
  };

  const filteredConversations = useMemo(
    () =>
      conversations.filter((item) => {
        const conversationData = item.conversation || item;
        const content = conversationData.content || {};

        if (!isWithinDateRange(conversationData.createdAt, dateFrom, dateTo)) return false;
        if (categoryId && String(content.category?.id) !== categoryId) return false;
        if (contentId && String(content.id) !== contentId) return false;
        if (userId && !isUserInvolved(item, userId)) return false;

        return true;
      }),
    [conversations, dateFrom, dateTo, categoryId, contentId, userId]
  );

  const participatedConversationsCount = filteredConversations.filter((conversation) =>
    hasUserParticipated(conversation, currentUserId)
  ).length;

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-[#0d141b] dark:bg-background-dark dark:text-slate-200">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#0d141b] dark:text-white">
                  Foro de Ayuda
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Conversaciones abiertas desde los contenidos de la plataforma.
                </p>
                {!loading && conversations.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-lg border border-slate-200 px-3 py-1 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      {hasActiveFilters
                        ? `${filteredConversations.length} de ${conversations.length}`
                        : `${conversations.length} en total`}
                    </span>
                    <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                      {participatedConversationsCount} participas
                    </span>
                  </div>
                )}
              </div>
              <Link
                to="/admin/biblioteca"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90"
              >
                <span className="material-symbols-outlined text-base">library_books</span>
                Ver contenidos
              </Link>
            </div>

            {!loading && conversations.length > 0 && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <SegmentedControl
                    value={periodPreset}
                    onChange={applyPeriodPreset}
                    options={[
                      ["all", "Todo"],
                      ["thisMonth", "Este mes"],
                      ["lastMonth", "Mes anterior"],
                      ["custom", "Personalizado"],
                    ]}
                  />

                  {periodPreset === "custom" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        aria-label="Desde"
                        value={dateFrom}
                        max={dateTo || undefined}
                        onChange={handleManualDateChange(setDateFrom)}
                        className="input h-9 w-[8.5rem]"
                      />
                      <span className="text-slate-400">–</span>
                      <input
                        type="date"
                        aria-label="Hasta"
                        value={dateTo}
                        min={dateFrom || undefined}
                        onChange={handleManualDateChange(setDateTo)}
                        className="input h-9 w-[8.5rem]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <FilterSelect
                    value={categoryId}
                    onChange={handleCategoryChange}
                    placeholder="Categoria: todas"
                    options={categoryOptions.map((option) => [option.id, option.name])}
                  />

                  <FilterSelect
                    value={contentId}
                    onChange={(event) => setContentId(event.target.value)}
                    placeholder="Contenido: todos"
                    options={contentOptions.map((option) => [option.id, option.title])}
                  />

                  <FilterSelect
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="Usuario: todos"
                    options={userOptions.map((option) => [option.id, option.name])}
                  />

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="group inline-flex items-center gap-1 text-sm font-bold text-primary"
                    >
                      <span className="material-symbols-outlined text-lg">filter_alt_off</span>
                      <span className="group-hover:underline">Limpiar filtros</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-lg font-bold text-[#0d141b] dark:text-white">
                  Conversaciones recientes
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-sm text-slate-500 dark:text-slate-400">
                  Cargando conversaciones...
                </div>
              ) : error ? (
                <div className="m-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                  {error}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">forum</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">
                    Aun no hay conversaciones
                  </h3>
                  <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Abre un contenido y publica una pregunta para iniciar el foro.
                  </p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">filter_alt_off</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">
                    Ninguna conversacion coincide con estos filtros
                  </h3>
                  <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Ajusta el periodo, la categoria, el contenido o el usuario para ver mas resultados.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredConversations.map((conversation) => (
                    <ConversationRow
                      key={conversation.conversation?.id || conversation.id}
                      conversation={conversation}
                      isParticipant={hasUserParticipated(conversation, currentUserId)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

const FilterSelect = ({ value, onChange, placeholder, options }) => (
  <label className="relative h-9 shrink-0">
    <select
      value={value}
      onChange={onChange}
      className="h-9 w-48 appearance-none rounded-lg border border-slate-300 bg-white pl-4 pr-10 text-sm font-medium text-[#0d141b] transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <option value="">{placeholder}</option>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
      expand_more
    </span>
  </label>
);

const ConversationRow = ({ conversation, isParticipant }) => {
  const conversationData = conversation.conversation || conversation;
  const content = conversationData.content || {};
  const authorName = getUserName(conversationData.createdBy);
  const dateLabel = formatDate(conversationData.createdAt);
  const categoryName = content.category?.categoryName || "Sin categoria";
  const questionCount = conversation.questionCount ?? 0;

  return (
    <Link
      to="/video"
      state={{
        id: content.id,
        title: content.title,
        category: categoryName,
        description: content.description,
        url: content.urlVideo,
        createdBy: content.createdBy,
      }}
      className={`group flex flex-col gap-3 p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 ${
        isParticipant ? "bg-primary/[0.04] dark:bg-primary/[0.06]" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="line-clamp-2 text-base font-bold text-[#0d141b] group-hover:text-primary dark:text-white">
              {conversationData.title || "Conversacion sin titulo"}
            </h3>
            {isParticipant && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase text-primary">
                <span className="material-symbols-outlined text-sm">forum</span>
                Participante
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {content.title || "Contenido no disponible"}
          </p>
        </div>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Publicado por {authorName}</span>
        <span aria-hidden="true">-</span>
        <span>{dateLabel}</span>
        <span aria-hidden="true">-</span>
        <span>{questionCount} {questionCount === 1 ? "pregunta" : "preguntas"}</span>
      </div>
    </Link>
  );
};

const hasUserParticipated = (conversation, userId) => {
  if (!userId) return false;

  const participantIds = conversation.participantIds || [];
  return participantIds.some((participantId) => Number(participantId) === userId);
};

const isUserInvolved = (item, targetUserId) => {
  const conversationData = item.conversation || item;
  if (String(conversationData.createdBy?.id ?? "") === targetUserId) return true;

  return (item.participants || []).some((participant) => String(participant?.id ?? "") === targetUserId);
};

const buildCategoryOptions = (conversations) => {
  const map = new Map();

  conversations.forEach((item) => {
    const conversationData = item.conversation || item;
    const category = conversationData.content?.category;
    if (category?.id != null && !map.has(category.id)) {
      map.set(category.id, category.categoryName || "Sin categoria");
    }
  });

  return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name, "es", { sensitivity: "base" })
  );
};

const buildContentOptions = (conversations, categoryId) => {
  const map = new Map();

  conversations.forEach((item) => {
    const conversationData = item.conversation || item;
    const content = conversationData.content;
    if (!content || content.id == null) return;
    if (categoryId && String(content.category?.id) !== categoryId) return;
    if (!map.has(content.id)) {
      map.set(content.id, content.title || "Sin titulo");
    }
  });

  return Array.from(map, ([id, title]) => ({ id, title })).sort((a, b) =>
    a.title.localeCompare(b.title, "es", { sensitivity: "base" })
  );
};

const buildUserOptions = (conversations) => {
  const map = new Map();

  conversations.forEach((item) => {
    const conversationData = item.conversation || item;
    const candidates = [conversationData.createdBy, ...(item.participants || [])];

    candidates.forEach((user) => {
      if (user?.id != null && !map.has(user.id)) {
        map.set(user.id, { id: user.id, name: getUserName(user) });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
};

const getUserName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "Usuario";
};

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
