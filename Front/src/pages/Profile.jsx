import React, { useRef, useState } from "react";
import Toast from "../components/Toast";

const DEFAULT_PHOTO =
  "https://ui-avatars.com/api/?name=Usuario+UNAD&background=2563eb&color=fff&size=256";

const initialProfile = {
  nombre: "Jonathan Smith",
  email: "j.smith@corporate.com",
  telefono: "+1 (555) 123-4567",
  foto: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj5uMBnbPbRJtkv3DZhSz3IZyyw3ul4227h4eg6YZP67NKONmGUkqEyzNhhQQod6A18IHvAlsBoKkpT3Yrs_J6yO9ZWFpkz-wY--ux1n6QLy4Xk1HztrqHTCy-sVzVvF1EaX1IvjkS5hSJJ8z6ugckzW9huj1XRfim7rAvNtEq9pyOIaXVgLKKGmRJT6BYLuQXcHE197gftLIL12xIJ7DyvQtzRlN1B6NHmyjuhNXsJMTObzkKROUSdO916QEArhE5mRj3zrAoNyxH",
};

const Profile = () => {
  const fileInputRef = useRef(null);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedProfile(form);
    setToast("Perfil actualizado correctamente.");
  };

  const handleCancel = () => {
    setForm(savedProfile);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        foto: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setForm((current) => ({
      ...current,
      foto: DEFAULT_PHOTO,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <Toast message={toast} type="success" onClose={() => setToast("")} />

      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-3xl">corporate_fare</span>
          <h2 className="text-lg font-bold">Portal Corporativo</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div
            className="size-10 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700"
            style={{ backgroundImage: `url(${form.foto})` }}
          />
        </div>
      </header>

      <main className="flex justify-center py-12 px-4">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <h1 className="text-3xl font-black">Editar Perfil</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Administra tu informacion visible en la organizacion.
            </p>
          </div>

          <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <div
                className="size-32 rounded-full bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-800 shadow-lg"
                style={{ backgroundImage: `url(${form.foto})` }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:scale-105 transition"
                aria-label="Cambiar foto de perfil"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">Foto de Perfil</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Selecciona una imagen desde tu equipo.
              </p>

              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition"
                >
                  Cambiar Foto
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nombre Completo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Correo Electronico</label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="input bg-slate-100 dark:bg-slate-800 cursor-not-allowed pr-10"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400">
                    lock
                  </span>
                </div>
                <span className="text-xs text-slate-400 italic">
                  El correo es administrado por RRHH
                </span>
              </div>

              <Input
                label="Telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCancel}
                className="h-11 px-6 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="h-11 px-8 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400">
        (c) 2024 Portal Corporativo. Todos los derechos reservados.
      </footer>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold">{label}</label>
    <input {...props} className="input" required />
  </div>
);

export default Profile;
