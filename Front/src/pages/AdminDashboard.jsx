import { useEffect, useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import SegmentedControl from "../components/SegmentedControl";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  LoadingLine,
  Modal,
  PageHeader,
  Select,
  Stat,
} from "../components/ui";
import UserService from "../services/UserService";
import VideoService from "../services/VideoService";
import VideoStatsService from "../services/VideoStatsService";
import { getMaterialFormatsSummary } from "../utils/materialFormats";
import { getUserName, formatNumber } from "../utils/format";
import { normalizeRole, roleLabel, roleTone } from "../utils/role";
import {
  parseDateInput,
  buildDateRangeLabel,
  resolvePeriodPresetRange,
} from "../utils/periodFilters";

const PAGE_SIZE = 6;

const dateInputClasses =
  "h-9 w-[8.5rem] rounded-lg border border-line bg-surface px-2.5 text-sm text-fg transition-colors " +
  "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25";

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [periodPreset, setPeriodPreset] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [selectedContentId, setSelectedContentId] = useState(null);

  const applyPeriodPreset = (preset) => {
    setPeriodPreset(preset);
    setCurrentPage(1);

    const { dateFrom: nextFrom, dateTo: nextTo } = resolvePeriodPresetRange(preset);
    setDateFrom(nextFrom);
    setDateTo(nextTo);
  };

  const handleManualDateChange = (setter) => (event) => {
    setter(event.target.value);
    setPeriodPreset("custom");
    setCurrentPage(1);
  };

  const hasActiveFilters = periodPreset !== "all" || filterType !== "all";

  const clearAllFilters = () => {
    setPeriodPreset("all");
    setDateFrom("");
    setDateTo("");
    setFilterType("all");
    setFilterValue("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError("");

      try {
        const [contentData, userData, statsData] = await Promise.all([
          VideoService.getAll(),
          UserService.getAll(),
          VideoStatsService.getAll(),
        ]);

        setVideos(Array.isArray(contentData) ? contentData : []);
        setUsuarios(Array.isArray(userData) ? userData : []);
        setStats(Array.isArray(statsData) ? statsData : []);
      } catch (requestError) {
        console.error("Error cargando dashboard:", requestError);
        setError(
          requestError.response?.data?.error ||
            requestError.response?.data?.message ||
            "No se pudo cargar la informacion del panel."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const filteredStats = useMemo(
    () => filterStatsByDateRange(stats, dateFrom, dateTo),
    [stats, dateFrom, dateTo]
  );

  const categoryOptions = useMemo(() => buildCategoryOptions(videos), [videos]);
  const userOptions = useMemo(() => buildUserOptions(usuarios), [usuarios]);

  const scopedStats = useMemo(
    () => filterStatsBySelection(filteredStats, filterType, filterValue),
    [filteredStats, filterType, filterValue]
  );
  const scopedVideos = useMemo(
    () => (filterType === "category" && filterValue
      ? videos.filter((video) => String(video.category?.id) === String(filterValue))
      : videos),
    [videos, filterType, filterValue]
  );

  const analytics = useMemo(
    () => buildAnalytics({ videos: scopedVideos, users: usuarios, stats: scopedStats }),
    [scopedVideos, usuarios, scopedStats]
  );
  const paginatedVideoRows = useMemo(
    () => paginate(analytics.videoRows, currentPage, PAGE_SIZE),
    [analytics.videoRows, currentPage]
  );

  const selectedContentRow = useMemo(
    () => analytics.videoRows.find((row) => row.id === selectedContentId) || null,
    [analytics.videoRows, selectedContentId]
  );
  const selectedContentUserRows = useMemo(() => {
    if (!selectedContentId) return [];
    const contentStats = scopedStats.filter((stat) => Number(stat.content?.id) === Number(selectedContentId));
    return buildUserRows(contentStats);
  }, [scopedStats, selectedContentId]);

  const isUserFiltered = filterType === "user" && Boolean(filterValue);

  useEffect(() => {
    setCurrentPage((page) => clampPage(page, analytics.videoRows.length, PAGE_SIZE));
  }, [analytics.videoRows.length]);

  const exportReport = () => {
    const existingFrame = document.getElementById("pdf-report-frame");
    existingFrame?.remove();

    const frame = document.createElement("iframe");
    frame.id = "pdf-report-frame";
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.style.opacity = "0";
    document.body.appendChild(frame);

    const frameDocument = frame.contentWindow?.document;
    if (!frameDocument) return;

    const periodLabel = buildDateRangeLabel(dateFrom, dateTo);

    const filterLabel = buildFilterLabel(filterType, filterValue, categoryOptions, userOptions);

    frameDocument.open();
    frameDocument.write(buildPdfReportHtml(analytics, periodLabel, filterLabel));
    frameDocument.close();

    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 1000);
    };
  };

  const exportContentReport = (row, userRows) => {
    const existingFrame = document.getElementById("pdf-content-report-frame");
    existingFrame?.remove();

    const frame = document.createElement("iframe");
    frame.id = "pdf-content-report-frame";
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.style.opacity = "0";
    document.body.appendChild(frame);

    const frameDocument = frame.contentWindow?.document;
    if (!frameDocument) return;

    const periodLabel = buildDateRangeLabel(dateFrom, dateTo);
    const filterLabel = buildFilterLabel(filterType, filterValue, categoryOptions, userOptions);

    frameDocument.open();
    frameDocument.write(buildContentPdfReportHtml(row, userRows, periodLabel, filterLabel));
    frameDocument.close();

    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 1000);
    };
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Administración"
          title="Panel administrativo"
          description="Histórico y analítica de consumo de contenido."
          actions={
            <Button icon="download" onClick={exportReport} disabled={analytics.videoRows.length === 0}>
              Exportar reporte
            </Button>
          }
        />

        {error && <Alert tone="danger">{error}</Alert>}

        <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                  className={dateInputClasses}
                />
                <span className="text-fg-muted">–</span>
                <input
                  type="date"
                  aria-label="Hasta"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={handleManualDateChange(setDateTo)}
                  className={dateInputClasses}
                />
              </div>
            )}

            <div className="h-6 w-px bg-line" />

            <SegmentedControl
              value={filterType}
              onChange={(value) => {
                setFilterType(value);
                setFilterValue("");
                setCurrentPage(1);
              }}
              options={[
                ["all", "Todos"],
                ["category", "Categoría"],
                ["user", "Usuario"],
              ]}
            />

            {filterType !== "all" && (
              <Select
                aria-label={filterType === "category" ? "Selecciona una categoría" : "Selecciona un usuario"}
                value={filterValue}
                onChange={(event) => {
                  setFilterValue(event.target.value);
                  setCurrentPage(1);
                }}
                wrapperClassName="w-48"
              >
                <option value="">
                  {filterType === "category" ? "Selecciona una categoría" : "Selecciona un usuario"}
                </option>
                {(filterType === "category" ? categoryOptions : userOptions).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
            )}

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" icon="filter_alt_off" onClick={clearAllFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat
            icon="visibility"
            tone="brand"
            label="Visualizaciones"
            value={formatNumber(analytics.metrics.totalViews)}
            footer={`${analytics.metrics.uniqueViewers} usuarios únicos`}
          />
          <Stat
            icon="schedule"
            tone="success"
            label="Tiempo de video"
            value={formatHours(analytics.metrics.watchTimeSeconds)}
            footer={`${analytics.metrics.avgMinutesPerView} min por vista`}
          />
          <Stat
            icon="trending_up"
            tone="warning"
            label="Contenido con uso"
            value={`${analytics.metrics.contentWithViews}/${analytics.metrics.totalContent}`}
            footer={`${analytics.metrics.contentWithoutViews} sin visualizaciones`}
          />
          <Stat
            icon="group"
            tone="neutral"
            label="Usuarios activos"
            value={formatNumber(analytics.metrics.activeUsers)}
            footer={`${analytics.metrics.viewerCoverage}% han visto contenido`}
          />
        </section>

        {loading ? (
          <Card>
            <LoadingLine label="Cargando métricas..." />
          </Card>
        ) : (
          <SummaryView
            analytics={analytics}
            paginatedVideoRows={paginatedVideoRows}
            currentPage={currentPage}
            onPageChange={(page) =>
              setCurrentPage(clampPage(page, analytics.videoRows.length, PAGE_SIZE))
            }
            onSelectContent={(row) => setSelectedContentId(row.id)}
            isUserFiltered={isUserFiltered}
          />
        )}
      </div>

      {selectedContentRow && (
        <ContentDetailModal
          row={selectedContentRow}
          userRows={selectedContentUserRows}
          onClose={() => setSelectedContentId(null)}
          onExport={() => exportContentReport(selectedContentRow, selectedContentUserRows)}
        />
      )}
    </>
  );
};

const SummaryView = ({ analytics, paginatedVideoRows, currentPage, onPageChange, onSelectContent, isUserFiltered }) => (
  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
    <section className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon="show_chart" title="Tendencia mensual" subtitle="Visualizaciones registradas por mes" />
          <div className="mt-5">
            <TrendChart data={analytics.trendRows} />
          </div>
        </Card>
        <Card>
          <CardHeader
            icon="category"
            title="Categorías con mayor uso"
            subtitle="Participación por visualizaciones"
          />
          <div className="mt-5">
            <HorizontalBarChart
              data={analytics.categoryRows.slice(0, 6)}
              valueKey="views"
              labelKey="category"
              emptyText="Todavía no hay visualizaciones por categoría."
            />
          </div>
        </Card>
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <CardHeader
            icon="bar_chart"
            title="Rendimiento por contenido"
            subtitle="Clic en un contenido para ver el detalle por usuario"
          />
        </div>
        <ContentTable rows={paginatedVideoRows} onSelectContent={onSelectContent} />
        <Pagination
          page={currentPage}
          totalItems={analytics.videoRows.length}
          pageSize={PAGE_SIZE}
          onPageChange={onPageChange}
          itemLabel="contenidos"
        />
      </Card>
    </section>

    <aside className="flex flex-col gap-6">
      <Card>
        <CardHeader icon="lightbulb" title="Lecturas rápidas" subtitle="Hallazgos útiles del período" />
        <div className="mt-5 flex flex-col gap-3">
          {analytics.insights.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </Card>

      {!isUserFiltered && (
        <>
          <Card>
            <CardHeader icon="military_tech" title="Top usuarios" subtitle="Personas con mayor actividad" />
            <div className="mt-5 flex flex-col gap-3">
              {analytics.userRows.slice(0, 5).length === 0 ? (
                <EmptyState
                  icon="group_off"
                  title="Sin actividad"
                  description="No hay actividad de usuarios en este período."
                />
              ) : (
                analytics.userRows.slice(0, 5).map((user, index) => (
                  <RankItem
                    key={user.id}
                    index={index}
                    title={user.name}
                    detail={`${user.views} vistas · ${formatMinutes(user.watchTimeSeconds)}`}
                  />
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader icon="donut_large" title="Cobertura de usuarios" subtitle="Relación entre usuarios y consumo" />
            <div className="mt-5">
              <CoverageMeter value={analytics.metrics.viewerCoverage} />
            </div>
          </Card>

          <Card>
            <CardHeader icon="person_off" title="Usuarios sin actividad" subtitle="Candidatos para acompañamiento" />
            <div className="mt-5 flex flex-col gap-3">
              {analytics.inactiveUsers.slice(0, 8).length === 0 ? (
                <EmptyState
                  icon="task_alt"
                  title="Todos con actividad"
                  description="Todos los usuarios han tenido actividad registrada."
                />
              ) : (
                analytics.inactiveUsers.slice(0, 8).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line p-3"
                  >
                    <p className="min-w-0 truncate font-semibold text-fg">{getUserName(user)}</p>
                    <Badge tone={roleTone(user.role?.roleName)} size="sm">
                      {roleLabel(user.role?.roleName)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </aside>
  </div>
);

const STATUS_TONES = {
  Alto: "success",
  Medio: "brand",
  Bajo: "warning",
  "Sin uso": "danger",
};

const statusTone = (status) => STATUS_TONES[status] || "neutral";

const ContentTable = ({ rows, onSelectContent }) => {
  if (rows.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="insights"
          title="No hay contenido registrado"
          description="No hay contenido registrado para mostrar estadísticas."
        />
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Contenido</th>
            <th>Categoría</th>
            <th>Tipo</th>
            <th className="text-right">Vistas</th>
            <th className="text-right">Usuarios</th>
            <th className="text-right">Tiempo</th>
            <th>Última actividad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onSelectContent?.(row)} className="cursor-pointer">
              <td className="min-w-56 font-semibold text-brand-ink">{row.title}</td>
              <td className="text-fg-muted">{row.category}</td>
              <td className="text-fg-muted">{row.type}</td>
              <td className="text-right font-bold text-fg">{formatNumber(row.views)}</td>
              <td className="text-right text-fg-muted">{row.uniqueUsers}</td>
              <td className="text-right text-fg-muted">{formatMinutes(row.watchTimeSeconds)}</td>
              <td className="text-fg-muted">{formatDate(row.lastViewAt)}</td>
              <td>
                <Badge tone={statusTone(row.status)}>{row.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ContentDetailModal = ({ row, userRows, onClose, onExport }) => (
  <Modal
    open
    onClose={onClose}
    icon="movie"
    size="lg"
    title={row.title}
    subtitle={`${row.category} · ${row.type}`}
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        <Button icon="download" onClick={onExport} disabled={userRows.length === 0}>
          Exportar reporte
        </Button>
      </>
    }
  >
    <div className="grid gap-3 sm:grid-cols-4">
      <DetailStat label="Vistas" value={formatNumber(row.views)} />
      <DetailStat label="Usuarios únicos" value={row.uniqueUsers} />
      <DetailStat label="Tiempo de video" value={formatMinutes(row.watchTimeSeconds)} />
      <DetailStat label="Estado" value={<Badge tone={statusTone(row.status)}>{row.status}</Badge>} />
    </div>

    {userRows.length > 0 && (
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-line bg-subtle p-4">
        <Icon name="insights" size={20} className="mt-0.5 shrink-0 text-brand-ink" />
        <p className="text-sm leading-6 text-fg-muted">
          <span className="font-bold text-fg">{userRows[0].name}</span>{" "}
          (rol {userRows[0].role}) es quien mas consulta este contenido, con {userRows[0].views}{" "}
          {userRows[0].views === 1 ? "vista" : "vistas"} y {formatMinutes(userRows[0].watchTimeSeconds)}.
        </p>
      </div>
    )}

    <div className="mt-6">
      {userRows.length === 0 ? (
        <EmptyState
          icon="visibility_off"
          title="Sin visualizaciones en el período"
          description="Este contenido todavía no tiene visualizaciones en el período seleccionado."
        />
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th className="text-right">Vistas</th>
                <th className="text-right">Tiempo</th>
                <th>Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {userRows.map((user) => (
                <tr key={user.id}>
                  <td className="font-semibold text-fg">{user.name}</td>
                  <td>
                    <Badge tone={roleTone(user.role)} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="text-right font-bold text-fg">{user.views}</td>
                  <td className="text-right text-fg-muted">{formatMinutes(user.watchTimeSeconds)}</td>
                  <td className="text-fg-muted">{formatDate(user.lastViewAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </Modal>
);

const DetailStat = ({ label, value }) => (
  <div className="rounded-lg border border-line p-3">
    <p className="text-xs font-medium text-fg-subtle">{label}</p>
    <p className="mt-1 text-lg font-bold text-fg">{value}</p>
  </div>
);

const TrendChart = ({ data, showViewers = false }) => {
  const maxViews = Math.max(...data.map((row) => row.views), 1);

  if (data.length === 0) {
    return (
      <EmptyState
        icon="show_chart"
        title="Sin datos históricos"
        description="No hay datos históricos para graficar."
      />
    );
  }

  return (
    <div className="flex h-72 items-end gap-3 overflow-x-auto pb-2">
      {data.map((row) => {
        const height = Math.max(8, (row.views / maxViews) * 210);
        const viewerHeight = Math.max(6, (row.viewers / maxViews) * 210);

        return (
          <div key={row.key} className="flex min-w-16 flex-1 flex-col items-center justify-end gap-2">
            <div className="flex h-56 items-end gap-1">
              {showViewers && (
                <div
                  className="w-4 rounded-t bg-subtle"
                  style={{ height: `${viewerHeight}px` }}
                  title={`${row.viewers} usuarios`}
                />
              )}
              <div
                className="w-6 rounded-t bg-brand"
                style={{ height: `${height}px` }}
                title={`${row.views} visualizaciones`}
              />
            </div>
            <p className="text-xs font-bold text-fg-muted">{row.shortLabel}</p>
          </div>
        );
      })}
    </div>
  );
};

const HorizontalBarChart = ({
  data,
  labelKey,
  valueKey,
  valueFormatter = formatNumber,
  emptyText,
}) => {
  const max = Math.max(...data.map((row) => Number(row[valueKey] || 0)), 1);

  if (data.length === 0) {
    return <EmptyState icon="bar_chart" title="Sin datos" description={emptyText} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((row) => {
        const value = Number(row[valueKey] || 0);
        const width = Math.max(4, (value / max) * 100);

        return (
          <div key={row[labelKey]} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-semibold text-fg">{row[labelKey]}</span>
              <span className="shrink-0 font-bold text-brand-ink">{valueFormatter(value)}</span>
            </div>
            <div className="h-3 rounded-full bg-subtle">
              <div className="h-3 rounded-full bg-brand" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CoverageMeter = ({ value }) => (
  <div>
    <div className="flex items-end justify-between">
      <p className="text-sm text-fg-muted">Usuarios con actividad</p>
      <p className="text-3xl font-bold text-brand-ink">{value}%</p>
    </div>
    <div className="mt-4 h-4 rounded-full bg-subtle">
      <div className="h-4 rounded-full bg-brand" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  </div>
);

const InsightCard = ({ insight }) => (
  <div className="rounded-lg border border-line p-4">
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
        <Icon name={insight.icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="font-bold text-fg">{insight.title}</p>
        <p className="mt-1 text-sm leading-6 text-fg-muted">{insight.text}</p>
      </div>
    </div>
  </div>
);

const RankItem = ({ index, title, detail }) => (
  <div className="flex items-center gap-3 rounded-lg border border-line p-3">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-sm font-bold text-brand-ink">
      {index + 1}
    </div>
    <div className="min-w-0">
      <p className="truncate font-semibold text-fg">{title}</p>
      <p className="text-xs text-fg-muted">{detail}</p>
    </div>
  </div>
);

const buildAnalytics = ({ videos, users, stats }) => {
  const totalViews = stats.reduce((acc, stat) => acc + Number(stat.totalViews || 0), 0);
  const watchTimeSeconds = stats.reduce((acc, stat) => acc + Number(stat.watchTimeSeconds || 0), 0);
  const viewedContentIds = new Set(stats.filter(hasActivity).map((stat) => Number(stat.content?.id)));
  const uniqueViewerIds = new Set(stats.filter(hasActivity).map((stat) => Number(stat.user?.id)));
  const activeUsers = users.filter((user) => user.status === true).length;
  const totalUsers = users.length;

  const videoRows = videos
    .map((video) => buildVideoRow(video, stats))
    .sort((a, b) => b.views - a.views || b.watchTimeSeconds - a.watchTimeSeconds || a.title.localeCompare(b.title));

  const userRows = buildUserRows(stats);
  const categoryRows = buildCategoryRows(stats);
  const trendRows = buildTrendRows(stats);
  const inactiveUsers = users.filter((user) => !uniqueViewerIds.has(Number(user.id)));
  const contentWithoutViews = videos.length - viewedContentIds.size;

  const metrics = {
    totalViews,
    watchTimeSeconds,
    uniqueViewers: uniqueViewerIds.size,
    activeUsers,
    totalUsers,
    totalContent: videos.length,
    contentWithViews: viewedContentIds.size,
    contentWithoutViews,
    avgMinutesPerView: totalViews > 0 ? (watchTimeSeconds / 60 / totalViews).toFixed(1) : "0.0",
    viewerCoverage: totalUsers > 0 ? Math.round((uniqueViewerIds.size / totalUsers) * 100) : 0,
    highUseContent: videoRows.filter((row) => row.status === "Alto").length,
    mediumUseContent: videoRows.filter((row) => row.status === "Medio").length,
    lowUseContent: videoRows.filter((row) => row.status === "Bajo").length,
  };

  return {
    metrics,
    videoRows,
    userRows,
    categoryRows,
    trendRows,
    inactiveUsers,
    insights: buildInsights({ videoRows, categoryRows, userRows, metrics }),
  };
};

const buildVideoRow = (video, stats) => {
  const videoStats = stats.filter((stat) => Number(stat.content?.id) === Number(video.id));
  const views = videoStats.reduce((acc, stat) => acc + Number(stat.totalViews || 0), 0);
  const watchTimeSeconds = videoStats.reduce((acc, stat) => acc + Number(stat.watchTimeSeconds || 0), 0);
  const uniqueUsers = new Set(videoStats.filter(hasActivity).map((stat) => Number(stat.user?.id))).size;
  const latestStat = videoStats.reduce(getLatestStat, null);
  const hasVideo = Boolean(String(video.urlVideo || "").trim());
  const hasMaterials = Array.isArray(video.materials) && video.materials.length > 0;
  const materialSummary = getMaterialFormatsSummary(video.materials || []);

  return {
    id: video.id,
    title: video.title || "Sin titulo",
    category: video.category?.categoryName || "Sin categoria",
    views,
    uniqueUsers,
    watchTimeSeconds,
    avgMinutesPerView: views > 0 ? watchTimeSeconds / 60 / views : 0,
    lastUser: latestStat?.user ? getUserName(latestStat.user) : "Sin visualizaciones",
    lastViewAt: latestStat?.lastViewAt,
    type: hasVideo ? (hasMaterials ? `Video + ${materialSummary}` : "Video") : materialSummary || "Material",
    status: getUsageStatus(views),
  };
};

const buildUserRows = (stats) => {
  const rows = new Map();

  stats.filter(hasActivity).forEach((stat) => {
    const userId = Number(stat.user?.id);
    if (!userId) return;

    const current = rows.get(userId) || {
      id: userId,
      name: getUserName(stat.user),
      role: normalizeRole(stat.user?.role?.roleName),
      views: 0,
      watchTimeSeconds: 0,
      contentIds: new Set(),
      lastViewAt: null,
    };

    current.views += Number(stat.totalViews || 0);
    current.watchTimeSeconds += Number(stat.watchTimeSeconds || 0);
    if (stat.content?.id) current.contentIds.add(Number(stat.content.id));
    current.lastViewAt = maxDate(current.lastViewAt, stat.lastViewAt);
    rows.set(userId, current);
  });

  return Array.from(rows.values())
    .map((row) => ({ ...row, contentCount: row.contentIds.size }))
    .sort((a, b) => b.views - a.views || b.watchTimeSeconds - a.watchTimeSeconds);
};

const buildCategoryRows = (stats) => {
  const rows = new Map();

  stats.filter(hasActivity).forEach((stat) => {
    const category = stat.content?.category?.categoryName || "Sin categoria";
    const current = rows.get(category) || {
      category,
      views: 0,
      watchTimeSeconds: 0,
      userIds: new Set(),
      contentIds: new Set(),
    };

    current.views += Number(stat.totalViews || 0);
    current.watchTimeSeconds += Number(stat.watchTimeSeconds || 0);
    if (stat.user?.id) current.userIds.add(Number(stat.user.id));
    if (stat.content?.id) current.contentIds.add(Number(stat.content.id));
    rows.set(category, current);
  });

  return Array.from(rows.values())
    .map((row) => ({
      ...row,
      users: row.userIds.size,
      contents: row.contentIds.size,
    }))
    .sort((a, b) => b.views - a.views || b.watchTimeSeconds - a.watchTimeSeconds);
};

const buildTrendRows = (stats) => {
  const rows = new Map();

  stats.filter(hasActivity).forEach((stat) => {
    const key = getPeriodKey(stat);
    const current = rows.get(key) || {
      key,
      date: getPeriodDate(stat),
      label: formatPeriod(stat),
      shortLabel: formatShortPeriod(stat),
      views: 0,
      watchTimeSeconds: 0,
      userIds: new Set(),
    };

    current.views += Number(stat.totalViews || 0);
    current.watchTimeSeconds += Number(stat.watchTimeSeconds || 0);
    if (stat.user?.id) current.userIds.add(Number(stat.user.id));
    rows.set(key, current);
  });

  return Array.from(rows.values())
    .map((row) => ({ ...row, viewers: row.userIds.size }))
    .sort((a, b) => a.date - b.date);
};

const getPeriodBounds = (stat) => {
  const date = getPeriodDate(stat);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

const filterStatsByDateRange = (stats, dateFrom, dateTo) => {
  const from = parseDateInput(dateFrom);
  let to = parseDateInput(dateTo);
  if (to) {
    to = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);
  }
  const effectiveFrom = from && to && from > to ? to : from;
  const effectiveTo = from && to && from > to ? from : to;

  if (!effectiveFrom && !effectiveTo) return stats;

  return stats.filter((stat) => {
    const { start, end } = getPeriodBounds(stat);
    if (effectiveFrom && end < effectiveFrom) return false;
    if (effectiveTo && start > effectiveTo) return false;
    return true;
  });
};

const buildInsights = ({ videoRows, categoryRows, userRows, metrics }) => {
  const topVideo = videoRows[0]?.views > 0 ? videoRows[0] : null;
  const topCategory = categoryRows[0];
  const lowEngagement = videoRows
    .filter((row) => row.views > 0)
    .sort((a, b) => a.avgMinutesPerView - b.avgMinutesPerView)[0];
  const topUser = userRows[0];

  return [
    {
      icon: "workspace_premium",
      title: "Contenido mas consultado",
      text: topVideo
        ? `${topVideo.title} concentra ${topVideo.views} visualizaciones y ${formatMinutes(topVideo.watchTimeSeconds)}.`
        : "Aun no hay visualizaciones registradas.",
    },
    {
      icon: "category",
      title: "Categoria lider",
      text: topCategory
        ? `${topCategory.category} suma ${topCategory.views} visualizaciones de ${topCategory.users} usuarios.`
        : "Todavia no existe una categoria con consumo registrado.",
    },
    {
      icon: "person_search",
      title: "Usuario mas activo",
      text: topUser
        ? `${topUser.name} ha visto ${topUser.views} veces en ${topUser.contentCount} contenidos.`
        : "No hay usuarios con actividad en el periodo.",
    },
    {
      icon: "priority_high",
      title: "Oportunidad de mejora",
      text:
        metrics.contentWithoutViews > 0
          ? `${metrics.contentWithoutViews} contenidos no tienen visualizaciones. Conviene revisar titulos, categorias o difusion.`
          : lowEngagement
            ? `${lowEngagement.title} tiene el menor tiempo promedio por vista: ${lowEngagement.avgMinutesPerView.toFixed(1)} min.`
            : "Todos los contenidos publicados tienen actividad registrada.",
    },
  ];
};

const buildCategoryOptions = (videos) => {
  const map = new Map();
  videos.forEach((video) => {
    const id = video.category?.id;
    if (id != null && !map.has(id)) {
      map.set(id, video.category?.categoryName || "Sin categoria");
    }
  });

  return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name, "es", { sensitivity: "base" })
  );
};

const buildUserOptions = (users) =>
  users
    .map((user) => ({ id: user.id, name: getUserName(user) }))
    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

const filterStatsBySelection = (stats, filterType, filterValue) => {
  if (filterType === "category" && filterValue) {
    return stats.filter((stat) => String(stat.content?.category?.id) === String(filterValue));
  }
  if (filterType === "user" && filterValue) {
    return stats.filter((stat) => String(stat.user?.id) === String(filterValue));
  }
  return stats;
};

const buildFilterLabel = (filterType, filterValue, categoryOptions, userOptions) => {
  if (filterType === "category") {
    const category = categoryOptions.find((option) => String(option.id) === String(filterValue));
    return category ? `Categoria: ${category.name}` : "Categoria: todas";
  }
  if (filterType === "user") {
    const user = userOptions.find((option) => String(option.id) === String(filterValue));
    return user ? `Usuario: ${user.name}` : "Usuario: todos";
  }
  return null;
};

const getUsageStatus = (views) => {
  if (views <= 0) return "Sin uso";
  if (views >= 20) return "Alto";
  if (views >= 5) return "Medio";
  return "Bajo";
};

const hasActivity = (stat) =>
  Number(stat.totalViews || 0) > 0 || Number(stat.watchTimeSeconds || 0) > 0;

const getLatestStat = (latest, stat) => {
  if (!latest) return stat;
  return new Date(stat.lastViewAt || 0) > new Date(latest.lastViewAt || 0) ? stat : latest;
};

const maxDate = (current, candidate) => {
  if (!candidate) return current;
  if (!current) return candidate;
  return new Date(candidate) > new Date(current) ? candidate : current;
};

const getPeriodKey = (stat) => {
  const year = Number(stat.periodYear || new Date(stat.lastViewAt || Date.now()).getFullYear());
  const month = Number(stat.periodMonth || new Date(stat.lastViewAt || Date.now()).getMonth() + 1);
  return `${year}-${String(month).padStart(2, "0")}`;
};

const getPeriodDate = (stat) => {
  const [year, month] = getPeriodKey(stat).split("-").map(Number);
  return new Date(year, month - 1, 1);
};

const formatPeriod = (stat) =>
  new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(getPeriodDate(stat));

const formatShortPeriod = (stat) =>
  new Intl.DateTimeFormat("es-CO", { month: "short", year: "2-digit" }).format(getPeriodDate(stat));

const formatDate = (value) => {
  if (!value) return "Sin actividad";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin actividad";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatMinutes = (seconds) => {
  const minutes = Math.round(Number(seconds || 0) / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} h ${remaining} min` : `${hours} h`;
};

const formatHours = (seconds) => {
  const hours = Number(seconds || 0) / 3600;
  if (hours < 1) return `${Math.round(Number(seconds || 0) / 60)} min`;
  return `${hours.toFixed(1)} h`;
};

const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

const clampPage = (page, totalItems, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.min(Math.max(1, page), totalPages);
};

const REPORT_STYLES = `
          @page { margin: 18mm 14mm; }
          * { box-sizing: border-box; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          body { color: #101922; font-family: Arial, sans-serif; margin: 0; }
          h1 { font-size: 22px; margin: 0 0 6px; }
          h2 { font-size: 14px; margin: 0 0 2px; }
          h3 { font-size: 10px; color: #5f6f82; font-weight: 400; margin: 0 0 10px; }
          .subtitle { color: #5f6f82; font-size: 11px; margin-bottom: 18px; }
          .metrics { display: grid; gap: 10px; grid-template-columns: repeat(4, 1fr); margin-bottom: 22px; }
          .metric { border: 1px solid #d9e2ec; border-radius: 8px; padding: 12px; }
          .metric-label { color: #5f6f82; font-size: 9px; margin-bottom: 6px; }
          .metric-value { font-size: 17px; font-weight: 700; }
          .metric-detail { color: #5f6f82; font-size: 9px; margin-top: 4px; }
          .panel { border: 1px solid #d9e2ec; border-radius: 8px; padding: 14px; margin-bottom: 18px; break-inside: avoid; }
          .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          table { border-collapse: collapse; font-size: 9.5px; width: 100%; }
          th { background: #eef5ff; color: #2f5f9f; font-size: 8.5px; letter-spacing: .04em; text-align: left; text-transform: uppercase; }
          th, td { border-bottom: 1px solid #e5ebf1; padding: 7px 6px; vertical-align: top; }
          .right { text-align: right; }
          .pill { display: inline-block; border-radius: 999px; padding: 2px 8px; font-size: 8.5px; font-weight: 700; }
          .pill-alto { background: #d1fae5; color: #047857; }
          .pill-medio { background: #dbeafe; color: #1d4ed8; }
          .pill-bajo { background: #fef3c7; color: #b45309; }
          .pill-sinuso { background: #fee2e2; color: #b91c1c; }
          .trend { display: flex; gap: 6px; height: 110px; }
          .trend-col { flex: 1; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; }
          .trend-bar { width: 60%; min-height: 2px; background: #2563eb; border-radius: 3px 3px 0 0; }
          .trend-label { font-size: 8px; color: #5f6f82; }
          .hbar-row { margin-bottom: 10px; }
          .hbar-head { display: flex; justify-content: space-between; font-size: 9.5px; margin-bottom: 3px; }
          .hbar-track { height: 7px; background: #eef2f6; border-radius: 999px; }
          .hbar-fill { height: 7px; background: #2563eb; border-radius: 999px; }
          .insight { border: 1px solid #e5ebf1; border-radius: 6px; padding: 9px 10px; margin-bottom: 8px; }
          .insight-title { font-size: 10px; font-weight: 700; margin-bottom: 2px; }
          .insight-text { font-size: 9.5px; color: #445064; line-height: 1.4; }
          .rank { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f3f7; font-size: 9.5px; }
          .rank:last-child { border-bottom: none; }
          .rank-index { flex-shrink: 0; width: 18px; height: 18px; border-radius: 6px; background: #eef5ff; color: #2f5f9f; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
          .empty { color: #7c879e; font-size: 9.5px; font-style: italic; }
`;

const buildPdfReportHtml = (analytics, periodLabel, filterLabel) => {
  const generatedAt = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const { metrics, videoRows, categoryRows, trendRows, insights, userRows } = analytics;

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Reporte historico de metricas</title>
        <style>${REPORT_STYLES}</style>
      </head>
      <body>
        <h1>Reporte historico de metricas</h1>
        <div class="subtitle">Periodo: ${escapeHtml(periodLabel)}${filterLabel ? ` | ${escapeHtml(filterLabel)}` : ""} | Generado el ${escapeHtml(generatedAt)}</div>

        <section class="metrics">
          <div class="metric">
            <div class="metric-label">Visualizaciones</div>
            <div class="metric-value">${metrics.totalViews.toLocaleString("es-CO")}</div>
            <div class="metric-detail">${metrics.uniqueViewers} usuarios unicos</div>
          </div>
          <div class="metric">
            <div class="metric-label">Tiempo de video</div>
            <div class="metric-value">${escapeHtml(formatHours(metrics.watchTimeSeconds))}</div>
            <div class="metric-detail">${metrics.avgMinutesPerView} min por vista</div>
          </div>
          <div class="metric">
            <div class="metric-label">Contenido con uso</div>
            <div class="metric-value">${metrics.contentWithViews}/${metrics.totalContent}</div>
            <div class="metric-detail">${metrics.contentWithoutViews} sin visualizaciones</div>
          </div>
          <div class="metric">
            <div class="metric-label">Usuarios activos</div>
            <div class="metric-value">${metrics.activeUsers.toLocaleString("es-CO")}</div>
            <div class="metric-detail">${metrics.viewerCoverage}% han visto contenido</div>
          </div>
        </section>

        <div class="two-col">
          <div class="panel">
            <h2>Tendencia mensual</h2>
            <h3>Visualizaciones registradas por mes</h3>
            ${buildTrendChartHtml(trendRows)}
          </div>
          <div class="panel">
            <h2>Categorias con mayor uso</h2>
            <h3>Participacion por visualizaciones</h3>
            ${buildCategoryBarsHtml(categoryRows.slice(0, 6))}
          </div>
        </div>

        <div class="panel">
          <h2>Rendimiento por contenido</h2>
          <h3>Ranking accionable para priorizar mejoras</h3>
          ${buildContentTableHtml(videoRows)}
        </div>

        <div class="two-col">
          <div class="panel">
            <h2>Lecturas rapidas</h2>
            <h3>Hallazgos utiles del periodo</h3>
            ${buildInsightsHtml(insights)}
          </div>
          <div class="panel">
            <h2>Top usuarios</h2>
            <h3>Personas con mayor actividad</h3>
            ${buildTopUsersHtml(userRows.slice(0, 10))}
          </div>
        </div>
      </body>
    </html>
  `;
};

const buildContentPdfReportHtml = (row, userRows, periodLabel, filterLabel) => {
  const generatedAt = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const topUser = userRows[0];

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Reporte de contenido - ${escapeHtml(row.title)}</title>
        <style>${REPORT_STYLES}</style>
      </head>
      <body>
        <h1>${escapeHtml(row.title)}</h1>
        <div class="subtitle">
          ${escapeHtml(row.category)} &middot; ${escapeHtml(row.type)} | Periodo: ${escapeHtml(periodLabel)}${filterLabel ? ` | ${escapeHtml(filterLabel)}` : ""} | Generado el ${escapeHtml(generatedAt)}
        </div>

        <section class="metrics">
          <div class="metric">
            <div class="metric-label">Visualizaciones</div>
            <div class="metric-value">${row.views.toLocaleString("es-CO")}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Usuarios unicos</div>
            <div class="metric-value">${row.uniqueUsers}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Tiempo de video</div>
            <div class="metric-value">${escapeHtml(formatMinutes(row.watchTimeSeconds))}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Estado</div>
            <div class="metric-value">${buildStatusPillHtml(row.status)}</div>
          </div>
        </section>

        <div class="panel">
          <h2>Quien mas lo consulta</h2>
          <h3>Persona con mayor actividad sobre este contenido</h3>
          ${
            topUser
              ? `<p class="insight-text"><strong>${escapeHtml(topUser.name)}</strong> (rol ${escapeHtml(topUser.role)}) con ${topUser.views} ${topUser.views === 1 ? "vista" : "vistas"} y ${escapeHtml(formatMinutes(topUser.watchTimeSeconds))}.</p>`
              : `<p class="empty">Este contenido todavia no tiene visualizaciones en el periodo seleccionado.</p>`
          }
        </div>

        <div class="panel">
          <h2>Detalle por usuario</h2>
          <h3>Vistas, tiempo y ultima actividad por persona</h3>
          ${buildContentUserTableHtml(userRows)}
        </div>
      </body>
    </html>
  `;
};

const buildContentUserTableHtml = (userRows) => {
  if (userRows.length === 0) {
    return `<p class="empty">No hay usuarios con actividad registrada para este contenido.</p>`;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Usuario</th><th>Rol</th><th class="right">Vistas</th>
          <th class="right">Tiempo</th><th>Ultima actividad</th>
        </tr>
      </thead>
      <tbody>
        ${userRows
          .map(
            (user) => `
              <tr>
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.role)}</td>
                <td class="right">${user.views}</td>
                <td class="right">${escapeHtml(formatMinutes(user.watchTimeSeconds))}</td>
                <td>${escapeHtml(formatDate(user.lastViewAt))}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const buildTrendChartHtml = (trendRows) => {
  if (trendRows.length === 0) {
    return `<p class="empty">No hay datos historicos para graficar.</p>`;
  }

  const max = Math.max(...trendRows.map((row) => row.views), 1);

  return `
    <div class="trend">
      ${trendRows
        .map((row) => {
          const heightPct = Math.max(4, Math.round((row.views / max) * 100));
          return `
            <div class="trend-col">
              <div style="font-size:8px;color:#2563eb;font-weight:700;">${row.views}</div>
              <div class="trend-bar" style="height:${heightPct}%;"></div>
              <div class="trend-label">${escapeHtml(row.shortLabel)}</div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
};

const buildCategoryBarsHtml = (categoryRows) => {
  if (categoryRows.length === 0) {
    return `<p class="empty">Todavia no hay visualizaciones por categoria.</p>`;
  }

  const max = Math.max(...categoryRows.map((row) => row.views), 1);

  return categoryRows
    .map((row) => {
      const widthPct = Math.max(4, Math.round((row.views / max) * 100));
      return `
        <div class="hbar-row">
          <div class="hbar-head">
            <span>${escapeHtml(row.category)}</span>
            <strong>${row.views.toLocaleString("es-CO")}</strong>
          </div>
          <div class="hbar-track"><div class="hbar-fill" style="width:${widthPct}%;"></div></div>
        </div>
      `;
    })
    .join("");
};

const buildContentTableHtml = (videoRows) => {
  if (videoRows.length === 0) {
    return `<p class="empty">No hay contenido registrado para mostrar estadisticas.</p>`;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Contenido</th><th>Categoria</th><th>Tipo</th><th class="right">Vistas</th>
          <th class="right">Usuarios</th><th class="right">Tiempo</th><th>Ultima actividad</th><th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${videoRows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.title)}</td>
                <td>${escapeHtml(row.category)}</td>
                <td>${escapeHtml(row.type)}</td>
                <td class="right">${row.views.toLocaleString("es-CO")}</td>
                <td class="right">${row.uniqueUsers}</td>
                <td class="right">${escapeHtml(formatMinutes(row.watchTimeSeconds))}</td>
                <td>${escapeHtml(formatDate(row.lastViewAt))}</td>
                <td>${buildStatusPillHtml(row.status)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const buildStatusPillHtml = (status) => {
  const classByStatus = {
    Alto: "pill-alto",
    Medio: "pill-medio",
    Bajo: "pill-bajo",
    "Sin uso": "pill-sinuso",
  };

  return `<span class="pill ${classByStatus[status] || "pill-bajo"}">${escapeHtml(status)}</span>`;
};

const buildInsightsHtml = (insights) => {
  if (insights.length === 0) {
    return `<p class="empty">No hay hallazgos para este periodo.</p>`;
  }

  return insights
    .map(
      (insight) => `
        <div class="insight">
          <div class="insight-title">${escapeHtml(insight.title)}</div>
          <div class="insight-text">${escapeHtml(insight.text)}</div>
        </div>
      `
    )
    .join("");
};

const buildTopUsersHtml = (userRows) => {
  if (userRows.length === 0) {
    return `<p class="empty">No hay actividad de usuarios en este periodo.</p>`;
  }

  return userRows
    .map(
      (user, index) => `
        <div class="rank">
          <div class="rank-index">${index + 1}</div>
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;">${escapeHtml(user.name)}</div>
            <div style="color:#5f6f82;font-size:8.5px;">${user.views} vistas | ${escapeHtml(formatMinutes(user.watchTimeSeconds))}</div>
          </div>
        </div>
      `
    )
    .join("");
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default AdminDashboard;
