import React, { useEffect, useState } from "react";

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "Empleado",
    estado: "Activo",
  });

  /* ================== CARGAR USUARIOS ================== */
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

  /* ================== MANEJO FORM ================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const nuevoUsuario = await res.json();
      setUsuarios([...usuarios, nuevoUsuario]);

      setForm({
        nombre: "",
        correo: "",
        rol: "Empleado",
        estado: "Activo",
      });

      alert("Usuario creado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
            Gestión de Usuarios
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
            Administra los usuarios registrados en la plataforma.
          </p>
        </div>

        {/* ================= FORMULARIO ================= */}
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-text-primary-light dark:text-text-primary-dark">
            Crear Nuevo Usuario
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <Input
              label="Nombre Completo"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />

            <Input
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
            />

            <Select
              label="Rol"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              options={["Administrador", "Empleado", "Supervisor"]}
            />

            <Select
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              options={["Activo", "Inactivo"]}
            />

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-surface-light dark:bg-surface-dark font-semibold"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-8 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition"
              >
                Crear Usuario
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLA ================= */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h2 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
              Lista de Usuarios
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-light dark:bg-surface-dark text-xs uppercase font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Correo</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, index) => (
                  <tr
                    key={index}
                    className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition"
                  >
                    <td className="px-6 py-4 font-semibold">{u.nombre}</td>
                    <td className="px-6 py-4">{u.correo}</td>
                    <td className="px-6 py-4">{u.rol}</td>
                    <td className="px-6 py-4">
                      <EstadoBadge estado={u.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuarios.length === 0 && (
              <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                No hay usuarios registrados aún.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTES AUXILIARES ================= */

const Input = ({ label, type = "text", ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <input
      type={type}
      {...props}
      className="input"
      required
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <select {...props} className="input">
      {options.map((op) => (
        <option key={op}>{op}</option>
      ))}
    </select>
  </div>
);

const EstadoBadge = ({ estado }) => (
  <span
    className={`px-3 py-1 text-xs font-bold rounded-full ${
      estado === "Activo"
        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
    }`}
  >
    {estado}
  </span>
);

export default Users;