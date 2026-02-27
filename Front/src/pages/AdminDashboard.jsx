import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [metricas, setMetricas] = useState({
    totalVisualizaciones: 0,
    usuariosActivos: 0,
    totalVideos: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [videosRes, usuariosRes] = await Promise.all([
          fetch("/api/videos"),
          fetch("/api/users"),
        ]);

        const videos = await videosRes.json();
        const usuarios = await usuariosRes.json();

        setMetricas({
          totalVisualizaciones: videos.reduce(
            (acc, v) => acc + (v.views || 0),
            0
          ),
          usuariosActivos: usuarios.length,
          totalVideos: videos.length,
        });
      } catch (error) {
        console.error("Error cargando métricas:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
              Panel Administrativo
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
              Vista general del rendimiento de la plataforma
            </p>
          </div>

          <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary/90 transition">
            <span className="material-symbols-outlined">download</span>
            Exportar Reporte
          </button>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <MetricCard
            icon="visibility"
            titulo="Total de Visualizaciones"
            valor={metricas.totalVisualizaciones.toLocaleString()}
          />
          <MetricCard
            icon="group"
            titulo="Usuarios Activos"
            valor={metricas.usuariosActivos}
          />
          <MetricCard
            icon="video_library"
            titulo="Total de Videos"
            valor={metricas.totalVideos}
          />
        </div>

        {/* Tabla de videos */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
              Estadísticas de Videos
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-light dark:bg-surface-dark text-xs uppercase font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                <tr>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3 text-right">Visualizaciones</th>
                  <th className="px-6 py-3">Progreso</th>
                </tr>
              </thead>
              <tbody>
                <VideoRow
                  titulo="Reunión General Q3"
                  categoria="Corporativo"
                  vistas="12.400"
                  progreso={82}
                />
                <VideoRow
                  titulo="Capacitación en Seguridad"
                  categoria="Formación"
                  vistas="8.900"
                  progreso={95}
                />
                <VideoRow
                  titulo="Lanzamiento de Producto"
                  categoria="Marketing"
                  vistas="5.200"
                  progreso={61}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección inferior */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Distribución de dispositivos */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-text-primary-light dark:text-text-primary-dark">
              Distribución por Dispositivo
            </h3>

            <DeviceRow etiqueta="Computador" porcentaje="65%" />
            <DeviceRow etiqueta="Aplicación Móvil" porcentaje="28%" />
            <DeviceRow etiqueta="Navegador Web" porcentaje="7%" />
          </div>

          {/* Estado del sistema */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-text-primary-light dark:text-text-primary-dark">
              Estado de la Plataforma
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Estado actual de los servicios y servidores
            </p>

            <div className="grid grid-cols-2 gap-4">
              <StatusCard label="Servidor Principal" estado="Operativo" color="green" />
              <StatusCard label="CDN Europa" estado="Operativo" color="green" />
              <StatusCard label="CDN Asia" estado="Operativo" color="green" />
              <StatusCard label="CDN LATAM" estado="Latencia Alta" color="yellow" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* COMPONENTES AUXILIARES */

const MetricCard = ({ icon, titulo, valor }) => (
  <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-primary/10 text-primary rounded-lg">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
      {titulo}
    </p>
    <p className="text-2xl font-bold mt-1 text-text-primary-light dark:text-text-primary-dark">
      {valor}
    </p>
  </div>
);

const VideoRow = ({ titulo, categoria, vistas, progreso }) => (
  <tr className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition">
    <td className="px-6 py-4 font-semibold">{titulo}</td>
    <td className="px-6 py-4">{categoria}</td>
    <td className="px-6 py-4 text-right">{vistas}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-border-light dark:bg-border-dark h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <span className="text-xs font-bold">{progreso}%</span>
      </div>
    </td>
  </tr>
);

const DeviceRow = ({ etiqueta, porcentaje }) => (
  <div className="flex justify-between items-center mb-4">
    <span className="text-text-secondary-light dark:text-text-secondary-dark">
      {etiqueta}
    </span>
    <span className="font-bold">{porcentaje}</span>
  </div>
);

const StatusCard = ({ label, estado, color }) => (
  <div className="p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
    <p className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
      {label}
    </p>
    <div className="flex items-center gap-2 mt-1">
      <span
        className={`w-2 h-2 rounded-full ${
          color === "green" ? "bg-green-500" : "bg-yellow-500"
        }`}
      />
      <span className="text-xs font-semibold">{estado}</span>
    </div>
  </div>
);

export default AdminDashboard;