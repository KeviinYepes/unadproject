import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';

export default function Main() {
  // Datos adaptados a la problemática de trámites y formularios
  const tutorials = [
    {
      title: 'Cómo completar la Declaración de Renta (Persona Física)',
      category: 'Impuestos',
      duration: 12,
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Llenado paso a paso: Formulario de Inscripción al RFC',
      category: 'Legal',
      duration: 8,
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Solicitud de Devolución de Impuestos 2024',
      category: 'Finanzas',
      duration: 15,
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Alta en el Seguro Social (Formulario de Afiliación)',
      category: 'Salud',
      duration: 6,
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Cómo solicitar el Subsidio de Vivienda (Paso a Paso)',
      category: 'Vivienda',
      duration: 10,
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Renovación de Licencia de Funcionamiento Comercial',
      category: 'Negocios',
      duration: 9,
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Formulario de Reclamación de Seguro de Desempleo',
      category: 'Laboral',
      duration: 7,
      imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Guía de trámites para el Pasaporte Internacional',
      category: 'Trámites Civiles',
      duration: 5,
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=500&auto=format&fit=crop',
    },
  ];

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-6">
            {/* Título de la página */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#101922] dark:text-white">
                Biblioteca de Guías Visuales
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Selecciona un formulario para ver el video instructivo y seguir los pasos.
              </p>
            </div>

            {/* Filtros / Chips */}
            <div className="flex flex-wrap gap-2">
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-slate-300 bg-white px-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                <p className="text-sm font-medium">Ordenar por: Recientes</p>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              
              {/* Categorías destacadas */}
              {['Impuestos', 'Salud', 'Laboral', 'Trámites Civiles'].map((cat) => (
                <button 
                  key={cat}
                  className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800"
                >
                  <p className="text-sm font-medium">{cat}</p>
                </button>
              ))}
            </div>

            {/* Grilla de videos */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
              {tutorials.map((tutorial, index) => (
                <Link
                  key={index}
                  to="/video"
                  state={tutorial} // Pasamos los datos al reproductor
                  className="group block transition-transform duration-300 hover:scale-[1.03]"
                >
                  <VideoCard
                    title={tutorial.title}
                    category={tutorial.category}
                    duration={`${tutorial.duration} min`} // Formateado en español
                    imageUrl={tutorial.imageUrl}
                  />
                  {/* Overlay sutil de "Ver guía" que aparece en hover */}
                  <div className="mt-2 flex items-center gap-1 text-sm font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="material-symbols-outlined text-base">play_circle</span>
                    Ver paso a paso
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}