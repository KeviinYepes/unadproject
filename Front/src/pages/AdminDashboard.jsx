import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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

        const videosData = await videosRes.json();
        const usuariosData = await usuariosRes.json();
        const videos = Array.isArray(videosData?.data) ? videosData.data : [];
        const usuarios = Array.isArray(usuariosData?.data) ? usuariosData.data : [];

        setMetricas({
          totalVisualizaciones: videos.reduce((acc, video) => acc + (video.views || 0), 0),
          usuariosActivos: usuarios.length,
          totalVideos: videos.length,
        });
      } catch (error) {
        console.error("Error cargando metricas:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
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

            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-light dark:border-border-dark">
                <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                  Estadisticas de Videos
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-light dark:bg-surface-dark text-xs uppercase font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                    <tr>
                      <th className="px-6 py-3">Titulo</th>
                      <th className="px-6 py-3">Categoria</th>
                      <th className="px-6 py-3 text-right">Visualizaciones</th>
                      <th className="px-6 py-3">Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <VideoRow
                      titulo="Reunion General Q3"
                      categoria="Corporativo"
                      vistas="12.400"
                      progreso={82}
                    />
                    <VideoRow
                      titulo="Capacitacion en Seguridad"
                      categoria="Formacion"
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
          </div>
        </main>
      </div>
    </div>
  );
};

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
          <div className="bg-primary h-full" style={{ width: `${progreso}%` }} />
        </div>
        <span className="text-xs font-bold">{progreso}%</span>
      </div>
    </td>
  </tr>
);

export default AdminDashboard;
