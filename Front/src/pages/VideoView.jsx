import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function VideoView() {
  const location = useLocation();
  const tutorial = location.state || {};

  // Datos por defecto si no vienen del state
  const defaultTitle = "Declaración de Renta 2024: Guía Completa";
  const defaultCategory = "Impuestos";

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              
              {/* Contenido Principal: Video y Detalles */}
              <div className="flex flex-col gap-6 lg:col-span-2">

                {/* Navegación (breadcrumb) removida por requerimiento */}

                {/* Encabezado de la Página */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-black leading-tight tracking-tight text-[#0d141b] dark:text-white">
                      {tutorial.title || defaultTitle}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {tutorial.category || defaultCategory}
                    </p>
                  </div>
                </div>

                {/* Reproductor de Video Personalizado */}
                <div className="group relative overflow-hidden rounded-2xl bg-black shadow-2xl">
                  <div
                    className="relative aspect-video flex items-center justify-center bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-80"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200')`,
                    }}
                  >
                    {/* Botón Play Central */}
                    <button className="flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40 backdrop-blur-sm transition-all hover:scale-110 active:scale-95">
                      <span className="material-symbols-outlined !text-5xl fill">play_arrow</span>
                    </button>
                  </div>

                  {/* Controles del Video (Simulados) */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="group/progress relative h-1.5 w-full cursor-pointer rounded-full bg-white/30">
                        <div className="absolute h-full w-1/3 rounded-full bg-primary">
                          <div className="absolute right-0 top-1/2 size-3 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover/progress:opacity-100 shadow-lg"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white">
                          <span className="material-symbols-outlined cursor-pointer hover:text-primary">play_arrow</span>
                          <span className="material-symbols-outlined cursor-pointer hover:text-primary">volume_up</span>
                          <p className="text-xs font-medium">04:15 / 15:20</p>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                          <span className="material-symbols-outlined cursor-pointer hover:text-primary">settings</span>
                          <span className="material-symbols-outlined cursor-pointer hover:text-primary">fullscreen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Información del Tutorial */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                  <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Sobre este entrenamiento</h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p>
                      En esta sesión aprenderás a navegar el nuevo portal tributario para realizar tu 
                      <strong> Declaración de Renta 2024</strong> de forma segura. Cubriremos desde la carga 
                      automática de datos hasta la validación manual de anexos.
                    </p>
                    <h3 className="text-lg font-bold">Puntos clave:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">check</span>
                        Configuración de perfil tributario
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">check</span>
                        Carga de certificados laborales
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">check</span>
                        Deducciones y beneficios de ley
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">check</span>
                        Generación del recibo de pago
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sección de Preguntas Rápidas (Vinculado al Foro) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">Dudas y Discusión</h2>
                    <Link to="/foro" className="text-sm font-bold text-primary hover:underline">Ver foro completo</Link>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {/* Input de comentario rápido */}
                    <div className="flex gap-4">
                      <div className="size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">edit_note</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                          placeholder="¿Tienes alguna duda sobre este video? Pregunta aquí..."
                          rows="2"
                        />
                        <button className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90">
                          Enviar Pregunta
                        </button>
                      </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* Preview de la duda que vimos en el foro */}
                    <div className="flex gap-4 opacity-80">
                      <div className="size-10 shrink-0 rounded-full bg-[url('https://i.pravatar.cc/150?u=ana')] bg-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">Ana García</p>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">hace 2 días</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 italic">
                          "En el minuto 4:15 no me aparece el botón de adjuntar..."
                        </p>
                        <Link to="/foro" className="mt-2 inline-block text-xs font-bold text-primary">
                          Ver respuesta experta (1)
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Recursos y Progreso */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 flex flex-col gap-6">
                  
                  {/* Documentos Relacionados */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <h3 className="mb-4 text-lg font-bold text-[#0d141b] dark:text-white">Material de apoyo</h3>
                    <div className="flex flex-col gap-3">
                      <button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30">
                          <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Checklist Renta 2024</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">PDF • 1.2 MB</p>
                        </div>
                      </button>
                      
                      <button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                          <span className="material-symbols-outlined">table_view</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Calculadora de Retenciones</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">EXCEL • 850 KB</p>
                        </div>
                      </button>
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