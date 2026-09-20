import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SegmentedControl from "../components/SegmentedControl";
import ForumService from "../services/ForumService";
import AuthService from "../services/AuthService";
import { isWithinDateRange, resolvePeriodPresetRange } from "../utils/periodFilters";
import { formatDateTime, getUserName } from "../utils/format";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  LoadingLine,
  PageHeader,
  Select,
} from "../components/ui";

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

  const hasActiveFilters =
    periodPreset !== "all" || Boolean(categoryId) || Boolean(contentId) || Boolean(userId);

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
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Aprendizaje"
        title="Foro de Ayuda"
        description="Conversaciones abiertas desde los contenidos de la plataforma."
        actions={
          <Button to="/admin/biblioteca" icon="library_books">
            Ver contenidos
          </Button>
        }
      >
        {!loading && conversations.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-line px-3 py-1 text-xs font-bold text-fg-muted">
              {hasActiveFilters
                ? `${filteredConversations.length} de ${conversations.length}`
                : `${conversations.length} en total`}
            </span>
            <span className="rounded-lg border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">
              {participatedConversationsCount} participas
            </span>
          </div>
        )}
      </PageHeader>

      {!loading && conversations.length > 0 && (
        <Card padded={false} className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                  <div className="w-[8.5rem]">
                    <Input
                      type="date"
                      aria-label="Desde"
                      value={dateFrom}
                      max={dateTo || undefined}
                      onChange={handleManualDateChange(setDateFrom)}
                    />
                  </div>
                  <span className="text-fg-subtle">–</span>
                  <div className="w-[8.5rem]">
                    <Input
                      type="date"
                      aria-label="Hasta"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={handleManualDateChange(setDateTo)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                value={categoryId}
                onChange={handleCategoryChange}
                placeholder="Categoría: todas"
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
                <Button variant="link" icon="filter_alt_off" onClick={clearAllFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card padded={false}>
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-base font-bold text-fg">Conversaciones recientes</h2>
        </div>

        {loading ? (
          <div className="px-6">
            <LoadingLine label="Cargando conversaciones..." />
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert tone="danger">{error}</Alert>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="forum"
              title="Aún no hay conversaciones"
              description="Abre un contenido y publica una pregunta para iniciar el foro."
              action={
                <Button to="/admin/biblioteca" icon="library_books">
                  Ver contenidos
                </Button>
              }
            />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="filter_alt_off"
              title="Ninguna conversación coincide con estos filtros"
              description="Ajusta el período, la categoría, el contenido o el usuario para ver más resultados."
              action={
                <Button variant="outline" icon="filter_alt_off" onClick={clearAllFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filteredConversations.map((conversation) => (
              <li key={conversation.conversation?.id || conversation.id}>
                <ConversationRow
                  conversation={conversation}
                  isParticipant={hasUserParticipated(conversation, currentUserId)}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

const FilterSelect = ({ value, onChange, placeholder, options }) => (
  <Select value={value} onChange={onChange} aria-label={placeholder} wrapperClassName="w-48">
    <option value="">{placeholder}</option>
    {options.map(([optionValue, optionLabel]) => (
      <option key={optionValue} value={optionValue}>
        {optionLabel}
      </option>
    ))}
  </Select>
);

const ConversationRow = ({ conversation, isParticipant }) => {
  const conversationData = conversation.conversation || conversation;
  const content = conversationData.content || {};
  const authorName = getUserName(conversationData.createdBy);
  const dateLabel = formatDateTime(conversationData.createdAt);
  const categoryName = content.category?.categoryName || "Sin categoría";
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
      className={`group flex flex-col gap-3 px-6 py-5 transition-colors hover:bg-subtle/60 ${
        isParticipant ? "bg-brand-soft/25" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="line-clamp-2 text-sm font-bold text-fg group-hover:text-brand-ink">
              {conversationData.title || "Conversación sin título"}
            </h3>
            {isParticipant && (
              <Badge tone="brand" size="sm" icon="forum">
                Participante
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            {content.title || "Contenido no disponible"}
          </p>
        </div>
        <Badge tone="neutral" size="sm" icon="category">
          {categoryName}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle">
        <span>Publicado por {authorName}</span>
        <span aria-hidden="true">·</span>
        <span>{dateLabel}</span>
        <span aria-hidden="true">·</span>
        <span>
          {questionCount} {questionCount === 1 ? "pregunta" : "preguntas"}
        </span>
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
      map.set(category.id, category.categoryName || "Sin categoría");
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
      map.set(content.id, content.title || "Sin título");
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
