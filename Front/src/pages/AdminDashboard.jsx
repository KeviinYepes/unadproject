import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import UserService from "../services/UserService";
import VideoService from "../services/VideoService";
import VideoStatsService from "../services/VideoStatsService";

const AdminDashboard = () => {
  const PAGE_SIZE = 5;
  const [videos, setVideos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const videoRows = useMemo(() => buildVideoRows(videos, stats), [videos, stats]);
  const paginatedVideoRows = useMemo(
    () => paginate(videoRows, currentPage, PAGE_SIZE),
    [videoRows, currentPage]
  );

  useEffect(() => {
    setCurrentPage((page) => clampPage(page, videoRows.length, PAGE_SIZE));
  }, [videoRows.length]);

  const metricas = useMemo(
    () => ({
      totalVisualizaciones: stats.reduce((acc, stat) => acc + Number(stat.totalViews || 0), 0),
      usuariosActivos: usuarios.filter((usuario) => usuario.status === true).length,
      totalVideos: videos.length,
    }),
    [stats, usuarios, videos]
  );

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

    frameDocument.open();
    frameDocument.write(buildPdfReportHtml(videoRows, metricas));
    frameDocument.close();

    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 1000);
    };
  };

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
                  Panel Administrativo
                </h1>
                <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                  Vista general del rendimiento de la plataforma
                </p>
              </div>

              <button
                type="button"
                onClick={exportReport}
                disabled={videoRows.length === 0}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-bold text-white shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined">download</span>
                Exportar Reporte
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <MetricCard
                icon="visibility"
                titulo="Total de Visualizaciones"
                valor={metricas.totalVisualizaciones.toLocaleString("es-CO")}
              />
              <MetricCard icon="group" titulo="Usuarios Activos" valor={metricas.usuariosActivos} />
              <MetricCard icon="video_library" titulo="Total de Videos" valor={metricas.totalVideos} />
            </div>

            <div className="overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm dark:border-border-dark dark:bg-card-dark">
              <div className="border-b border-border-light p-6 dark:border-border-dark">
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                  Estadisticas de Videos
                </h3>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Resumen acumulado por contenido.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-light text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:bg-surface-dark dark:text-text-secondary-dark">
                    <tr>
                      <th className="px-6 py-3">Titulo</th>
                      <th className="px-6 py-3">Categoria</th>
                      <th className="px-6 py-3 text-right">Visualizaciones</th>
                      <th className="px-6 py-3">Ultimo usuario</th>
                      <th className="px-6 py-3">Mes y ano</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-text-secondary-light dark:text-text-secondary-dark">
                          Cargando estadisticas...
                        </td>
                      </tr>
                    ) : videoRows.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-text-secondary-light dark:text-text-secondary-dark">
                          No hay contenido registrado para mostrar estadisticas.
                        </td>
                      </tr>
                    ) : (
                      paginatedVideoRows.map((row) => <VideoRow key={row.id} row={row} />)
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={currentPage}
                totalItems={videoRows.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setCurrentPage(clampPage(page, videoRows.length, PAGE_SIZE))}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, titulo, valor }) => (
  <div className="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
    <div className="mb-4 flex items-start justify-between">
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{titulo}</p>
    <p className="mt-1 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
      {valor}
    </p>
  </div>
);

const VideoRow = ({ row }) => (
  <tr className="border-b border-border-light transition last:border-b-0 hover:bg-background-light dark:border-border-dark dark:hover:bg-background-dark">
    <td className="px-6 py-4 font-semibold">{row.titulo}</td>
    <td className="px-6 py-4">{row.categoria}</td>
    <td className="px-6 py-4 text-right font-bold">{row.visualizaciones.toLocaleString("es-CO")}</td>
    <td className="px-6 py-4">{row.ultimoUsuario}</td>
    <td className="px-6 py-4">{row.periodoUltimaVisualizacion}</td>
  </tr>
);

const buildVideoRows = (videos, stats) =>
  videos.map((video) => {
    const videoStats = stats.filter((stat) => Number(stat.content?.id) === Number(video.id));
    const visualizaciones = videoStats.reduce((acc, stat) => acc + Number(stat.totalViews || 0), 0);
    const latestStat = videoStats.reduce((latest, stat) => {
      if (!latest) return stat;
      return new Date(stat.lastViewAt || 0) > new Date(latest.lastViewAt || 0) ? stat : latest;
    }, null);

    return {
      id: video.id,
      titulo: video.title || "Sin titulo",
      categoria: video.category?.categoryName || "Sin categoria",
      visualizaciones,
      ultimoUsuario: latestStat?.user ? getUserName(latestStat.user) : "Sin visualizaciones",
      periodoUltimaVisualizacion: latestStat ? formatPeriod(latestStat) : "Sin visualizaciones",
    };
  });

const getUserName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "Usuario";
};

const formatPeriod = (stat) => {
  if (stat.lastViewAt) {
    const date = new Date(stat.lastViewAt);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(date);
    }
  }

  if (stat.periodMonth && stat.periodYear) {
    const date = new Date(Number(stat.periodYear), Number(stat.periodMonth) - 1, 1);
    return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(date);
  }

  return "Sin visualizaciones";
};

const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

const clampPage = (page, totalItems, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.min(Math.max(1, page), totalPages);
};

const buildPdfReportHtml = (rows, metrics) => {
  const generatedAt = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Reporte de Estadisticas de Videos</title>
        <style>
          @page { margin: 24mm 18mm; }
          * { box-sizing: border-box; }
          body {
            color: #101922;
            font-family: Arial, sans-serif;
            margin: 0;
          }
          h1 {
            font-size: 24px;
            margin: 0 0 6px;
          }
          .subtitle {
            color: #5f6f82;
            font-size: 12px;
            margin-bottom: 24px;
          }
          .metrics {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(3, 1fr);
            margin-bottom: 24px;
          }
          .metric {
            border: 1px solid #d9e2ec;
            border-radius: 8px;
            padding: 14px;
          }
          .metric-label {
            color: #5f6f82;
            font-size: 11px;
            margin-bottom: 6px;
          }
          .metric-value {
            font-size: 22px;
            font-weight: 700;
          }
          table {
            border-collapse: collapse;
            font-size: 11px;
            width: 100%;
          }
          th {
            background: #eef5ff;
            color: #2f5f9f;
            font-size: 10px;
            letter-spacing: .04em;
            text-align: left;
            text-transform: uppercase;
          }
          th, td {
            border-bottom: 1px solid #d9e2ec;
            padding: 10px 8px;
            vertical-align: top;
          }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <h1>Reporte de Estadisticas de Videos</h1>
        <div class="subtitle">Generado el ${escapeHtml(generatedAt)}</div>

        <section class="metrics">
          <div class="metric">
            <div class="metric-label">Total de Visualizaciones</div>
            <div class="metric-value">${metrics.totalVisualizaciones.toLocaleString("es-CO")}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Usuarios Activos</div>
            <div class="metric-value">${metrics.usuariosActivos}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Total de Videos</div>
            <div class="metric-value">${metrics.totalVideos}</div>
          </div>
        </section>

        <table>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Categoria</th>
              <th class="right">Visualizaciones</th>
              <th>Ultimo usuario</th>
              <th>Mes y ano</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(row.titulo)}</td>
                    <td>${escapeHtml(row.categoria)}</td>
                    <td class="right">${row.visualizaciones.toLocaleString("es-CO")}</td>
                    <td>${escapeHtml(row.ultimoUsuario)}</td>
                    <td>${escapeHtml(row.periodoUltimaVisualizacion)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default AdminDashboard;
