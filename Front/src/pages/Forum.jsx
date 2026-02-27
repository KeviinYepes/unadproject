import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Forum() {
  return (
    <div className="relative flex min-h-screen w-full font-display bg-background-light text-[#0d141b] dark:bg-background-dark dark:text-slate-200">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Columna Izquierda: El Hilo de la Conversación */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Migas de pan (Breadcrumbs) */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="#"
                  className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400"
                >
                  Foro de Ayuda
                </Link>
                <span className="material-symbols-outlined text-base text-slate-400">chevron_right</span>
                <Link
                  to="#"
                  className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400"
                >
                  Soporte de Formularios
                </Link>
                <span className="material-symbols-outlined text-base text-slate-400">chevron_right</span>
                <span className="text-sm font-medium text-[#0d141b] dark:text-slate-200">
                  Duda con el paso 5 del video
                </span>
              </div>

              {/* Título y Estado */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white">
                    ¿No aparece el botón de "Adjuntar" en el Formulario 101?
                  </h1>
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-emerald-100 px-3 dark:bg-emerald-900/50">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Resuelto</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Publicado por Ana García hace 2 días</p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-blue-100/60 px-3 dark:bg-blue-900/30">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-300">Impuestos</p>
                  </div>
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-200/60 px-3 dark:bg-slate-800">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Video Tutorial #42</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Pregunta Principal */}
              <div className="flex w-full flex-row items-start justify-start gap-4">
                <div
                  className="aspect-square w-12 shrink-0 rounded-full bg-cover bg-center border-2 border-slate-200 dark:border-slate-700"
                  style={{
                    backgroundImage: "url('https://i.pravatar.cc/150?u=ana')",
                  }}
                />
                <div className="flex h-full flex-1 flex-col items-start justify-start">
                  <div className="flex w-full flex-row items-center justify-start gap-x-3">
                    <p className="text-sm font-bold text-[#0d141b] dark:text-white">Ana García</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">hace 2 días</p>
                  </div>
                  <div className="prose prose-sm dark:prose-invert mt-3 max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p>
                      ¡Hola! Estoy siguiendo el video paso a paso para la <strong>Declaración de Renta</strong>. 
                      En el minuto 4:15, el instructor hace clic en un botón verde de "Adjuntar Anexos", 
                      pero en mi pantalla ese botón no aparece por ningún lado.
                    </p>
                    <p>
                      ¿Alguien sabe si el portal cambió o si necesito activar alguna opción previa? 
                      Tengo que presentar esto mañana y estoy un poco bloqueada. ¡Gracias!
                    </p>
                  </div>
                  <div className="flex w-full flex-row items-center justify-start gap-6 pt-4">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-base">thumb_up</span>
                      <p className="text-sm font-medium">5</p>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-base">reply</span>
                      <p className="text-sm font-medium">Responder</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Respuestas */}
              <div className="mt-4 flex flex-col gap-6 border-l-2 border-slate-100 pl-6 dark:border-slate-800">
                {/* Respuesta del Experto/Soporte */}
                <div className="flex w-full flex-row items-start justify-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:border-primary/30 dark:bg-primary/10">
                  <div className="relative shrink-0">
                    <div
                      className="aspect-square w-12 rounded-full bg-cover bg-center border-2 border-primary/30"
                      style={{
                        backgroundImage: "url('https://i.pravatar.cc/150?u=carlos')",
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary border-2 border-white dark:border-background-dark">
                      <span className="material-symbols-outlined text-[12px] text-white fill">verified</span>
                    </div>
                  </div>
                  <div className="flex h-full flex-1 flex-col items-start justify-start">
                    <div className="flex w-full flex-row items-center justify-start gap-x-3">
                      <p className="text-sm font-bold text-[#0d141b] dark:text-white">Carlos Ruiz</p>
                      <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-primary dark:bg-primary/20 dark:text-primary-300">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        <p className="text-[10px] font-bold uppercase tracking-wider">Experto en Trámites</p>
                      </div>
                      <p className="ml-auto text-sm text-slate-500 dark:text-slate-400">hace 1 día</p>
                    </div>
                    <div className="prose prose-sm dark:prose-invert mt-3 max-w-none text-slate-700 dark:text-slate-300">
                      <p>
                        ¡Hola Ana! No te preocupes, el portal del Gobierno se actualizó ayer por la noche. 
                        Ahora, para que aparezca el botón de adjuntar, primero debes marcar la casilla de 
                        <strong> "Acepto términos de veracidad"</strong> que está al final de la sección anterior.
                      </p>
                      <p>
                        Acabamos de añadir una nota informativa en el video tutorial justo en ese minuto para avisar a otros usuarios. 
                        ¡Mucho éxito con tu trámite!
                      </p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-start gap-6 pt-4">
                      <button className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-base fill">thumb_up</span>
                        <p className="text-sm font-medium">18</p>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">reply</span>
                        <p className="text-sm font-medium">Responder</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor de Respuesta */}
              <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-8 dark:border-slate-800">
                <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">Tu respuesta</h3>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
                    <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-base">format_bold</span></button>
                    <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-base">format_italic</span></button>
                    <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-base">link</span></button>
                    <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-base">image</span></button>
                  </div>
                  <textarea
                    className="w-full border-0 bg-transparent p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0 dark:text-slate-300"
                    placeholder="Escribe un consejo o ayuda para la comunidad..."
                    rows="4"
                  />
                  <div className="flex items-center justify-between border-t border-slate-200 p-3 dark:border-slate-800">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-base">attach_file</span>
                      Subir captura de pantalla
                    </button>
                    <button className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-all">
                      Publicar respuesta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Derecha */}
            <aside className="flex flex-col gap-6 lg:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <h4 className="mb-4 text-base font-bold text-[#0d141b] dark:text-white">Detalles del Hilo</h4>
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Categoría</span>
                    <span className="font-bold text-primary">Impuestos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Respuestas</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Visto por</span>
                    <span className="font-medium">142 personas</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <h4 className="mb-4 text-base font-bold text-[#0d141b] dark:text-white">Video Relacionado</h4>
                <Link
                  to="/video"
                  className="group flex flex-col gap-3 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800"
                >
                  <div className="aspect-video w-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=300')" }} />
                  <div className="p-3">
                    <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                      Guía Completa: Declaración de Renta 2024
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Ver video ahora</p>
                  </div>
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <h4 className="mb-4 text-base font-bold text-[#0d141b] dark:text-white">Participantes</h4>
                <div className="flex flex-wrap gap-2">
                   {['ana', 'carlos', 'juan', 'marta'].map((user) => (
                     <div 
                        key={user}
                        className="size-10 rounded-full border-2 border-white bg-cover bg-center dark:border-slate-800"
                        style={{ backgroundImage: `url('https://i.pravatar.cc/100?u=${user}')` }}
                        title={user}
                     />
                   ))}
                   <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800">+8</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}