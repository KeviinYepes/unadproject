import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoService from '../services/VideoService';

export default function VideosLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    url: '',
  });

  const fallbackTutorials = [
    {
      title: 'Cómo completar la Declaración de Renta (Persona Física)',
      category: 'Impuestos',
      duration: 12,
      imageUrl:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Llenado paso a paso: Formulario de Inscripción al RFC',
      category: 'Legal',
      duration: 8,
      imageUrl:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Solicitud de Devolución de Impuestos 2024',
      category: 'Finanzas',
      duration: 15,
      imageUrl:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Alta en el Seguro Social (Formulario de Afiliación)',
      category: 'Salud',
      duration: 6,
      imageUrl:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Cómo solicitar el Subsidio de Vivienda (Paso a Paso)',
      category: 'Vivienda',
      duration: 10,
      imageUrl:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Renovación de Licencia de Funcionamiento Comercial',
      category: 'Negocios',
      duration: 9,
      imageUrl:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Formulario de Reclamación de Seguro de Desempleo',
      category: 'Laboral',
      duration: 7,
      imageUrl:
        'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=500&auto=format&fit=crop',
    },
    {
      title: 'Guía de trámites para el Pasaporte Internacional',
      category: 'Trámites Civiles',
      duration: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=500&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    cargarVideos();
  }, []);

  const cargarVideos = async () => {
    try {
      setLoading(true);
      const data = await VideoService.getAll();
      setVideos(Array.isArray(data) ? data : []);
      setError('');
    } catch (e) {
      console.error('Error cargando videos:', e);
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || 'Error al cargar videos';
      setError(msg);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setForm({ title: '', category: '', description: '', url: '' });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm({ title: '', category: '', description: '', url: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await VideoService.create({
        title: form.title,
        url: form.url,
        category: form.category || null,
        description: form.description || null,
      });
      alert('Contenido agregado correctamente');
      handleCloseModal();
      await cargarVideos();
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.error || err.response?.data?.message;
      const fallbackMessage = err.message || 'Error al guardar el contenido';
      const msg = apiMessage || fallbackMessage;
      setError(msg);
      alert('Error al guardar el contenido: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500&auto=format&fit=crop',
  ];

  const toCardItem = (video, index) => ({
    id: video.id,
    title: video.title,
    category: video.category || 'Sin categoría',
    duration: '--',
    imageUrl: placeholderImages[index % placeholderImages.length],
    url: video.url,
    description: video.description,
    createdAt: video.createdAt,
  });

  const items = videos.length > 0 ? videos.map(toCardItem) : fallbackTutorials.map((t, idx) => ({ ...t, id: `fallback-${idx}` }));

  const filteredTutorials = useMemo(() => {
    const q = searchQuery
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    if (!q) return items;

    const normalize = (value) =>
      String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    return items.filter((t) => {
      const haystack = `${normalize(t.title)} ${normalize(t.category)}`;
      return haystack.includes(q);
    });
  }, [searchQuery, items]);

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-6">
            {/* Título de la página */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#101922] dark:text-white">
                  Biblioteca de Guías Visuales
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Selecciona un formulario para ver el video instructivo y seguir los pasos.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreate}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Agregar contenido
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Buscador */}
            <label className="relative flex w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-xl text-text-light-secondary dark:text-dark-secondary">
                  search
                </span>
              </div>
              <input
                className="form-input h-10 w-full flex-1 rounded-lg border-none bg-background-light pl-10 text-sm placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-background-dark dark:placeholder:text-dark-secondary"
                placeholder="Search tutorials..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>

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
              {loading && filteredTutorials.length === 0 ? (
                <div className="col-span-full py-10 text-center text-text-light-secondary dark:text-dark-secondary">
                  Cargando contenido...
                </div>
              ) : (
                filteredTutorials.map((tutorial, index) => (
                <Link
                  key={tutorial.id ?? index}
                  to="/video"
                  state={tutorial}
                  className="group block transition-transform duration-300 hover:scale-[1.03]"
                >
                  <VideoCard
                    title={tutorial.title}
                    category={tutorial.category}
                    duration={tutorial.duration}
                    imageUrl={tutorial.imageUrl}
                  />
                  <div className="mt-2 flex items-center gap-1 text-sm font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="material-symbols-outlined text-base">play_circle</span>
                    Ver paso a paso
                  </div>
                </Link>
                ))
              )}
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <button
                  type="button"
                  className="absolute inset-0 bg-black/50"
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                />

                <div className="relative w-full max-w-3xl rounded-xl bg-card-light p-6 shadow-lg dark:bg-card-dark border border-border-light dark:border-border-dark">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        Agregar contenido multimedia
                      </h2>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                        Completa la información del contenido.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background-light text-text-light-secondary transition-colors hover:bg-primary/10 hover:text-primary dark:bg-background-dark dark:text-dark-secondary dark:hover:bg-primary/20 dark:hover:text-primary"
                      aria-label="Cerrar"
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Título"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      disabled={loading}
                    />

                    <Input
                      label="Categoría"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      disabled={loading}
                      required={false}
                      placeholder="Ej: Impuestos"
                    />

                    <div className="md:col-span-2">
                      <Textarea
                        label="Descripción"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={loading}
                        required={false}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="URL del contenido"
                        name="url"
                        value={form.url}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-2 rounded-lg bg-surface-light dark:bg-surface-dark font-semibold"
                        disabled={loading}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const Input = ({ label, type = 'text', required = true, disabled = false, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <input type={type} {...props} className="input" required={required} disabled={disabled} />
  </div>
);

const Textarea = ({ label, required = true, disabled = false, rows = 4, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <textarea {...props} rows={rows} className="input" required={required} disabled={disabled} />
  </div>
);
