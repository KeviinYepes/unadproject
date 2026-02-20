import React, { useState } from "react";

const VideosAdmin = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    visibility: "internal",
    commentsEnabled: false,
  });

  const [tags, setTags] = useState(["Capacitación"]);
  const [newTag, setNewTag] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    try {
      await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags }),
      });

      alert("Video publicado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al publicar el video");
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
              Subir Nuevo Video
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
              Completa la información para agregar contenido a la biblioteca.
            </p>
          </div>

          <div className="hidden lg:flex gap-4">
            <button className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
              Descartar
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary/90 transition"
            >
              Publicar Video
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 space-y-8">

            {/* Metadata */}
            <section className="card p-6 space-y-6">
              <SectionTitle icon="description" title="Información del Video" />

              <Input
                label="Título del Video"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Capacitación Seguridad 2026"
              />

              <Textarea
                label="Descripción"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe brevemente el contenido del video..."
              />

              {/* Tags */}
              <div>
                <label className="label">Palabras Clave</label>
                <div className="flex flex-wrap gap-2 p-3 border border-border-light dark:border-border-dark rounded-lg">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold flex items-center gap-1"
                    >
                      {tag}
                      <span
                        className="material-symbols-outlined text-[14px] cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        close
                      </span>
                    </span>
                  ))}
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={addTag}
                    className="bg-transparent outline-none text-sm flex-1"
                    placeholder="Agregar etiqueta..."
                  />
                </div>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  Presiona Enter para añadir
                </p>
              </div>
            </section>

            {/* Fuente del Video */}
            <section className="card p-6 space-y-6">
              <SectionTitle icon="cloud_upload" title="Fuente del Video" />

              <Input
                label="URL del Video"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="YouTube, Vimeo o enlace interno"
              />

              <div className="border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-8 text-center cursor-pointer hover:border-primary transition">
                <span className="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark">
                  upload_file
                </span>
                <p className="mt-2 font-semibold">
                  Arrastra un archivo o haz clic para subir
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  MP4, MOV, WEBM (máx 500MB)
                </p>
                <input type="file" className="hidden" />
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">

            {/* Visibilidad */}
            <section className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                Visibilidad
              </h3>

              {["internal", "public", "restricted"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark cursor-pointer hover:bg-background-light dark:hover:bg-background-dark"
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option}
                    checked={form.visibility === option}
                    onChange={handleChange}
                    className="text-primary"
                  />
                  <span className="font-semibold capitalize">
                    {option === "internal"
                      ? "Solo Interno"
                      : option === "public"
                      ? "Público"
                      : "Por Departamento"}
                  </span>
                </label>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                <span className="font-semibold">Permitir Comentarios</span>
                <input
                  type="checkbox"
                  name="commentsEnabled"
                  checked={form.commentsEnabled}
                  onChange={handleChange}
                  className="accent-primary"
                />
              </div>
            </section>

            {/* Consejo */}
            <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-2">
                <span className="material-symbols-outlined">lightbulb</span>
                <h4 className="font-bold text-sm">Consejo</h4>
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Usa al menos 3 etiquetas relevantes para mejorar la búsqueda dentro de la plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Mobile */}
        <div className="lg:hidden flex gap-4 mt-8">
          <button className="flex-1 bg-surface-light dark:bg-surface-dark py-3 rounded-lg font-bold">
            Descartar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-bold"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

/* COMPONENTES AUXILIARES */

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="material-symbols-outlined text-primary">
      {icon}
    </span>
    <h3 className="font-bold text-lg">{title}</h3>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="label">{label}</label>
    <input {...props} className="input" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="label">{label}</label>
    <textarea {...props} rows="4" className="input" />
  </div>
);

export default VideosAdmin;