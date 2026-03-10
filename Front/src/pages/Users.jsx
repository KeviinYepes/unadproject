import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserService from "../services/UserService";
import RoleService from "../services/RoleService";

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    documentType: "CC",
    documentNumber: "",
    roleId: "",
    active: true,
  });

  /* ================== CARGAR USUARIOS Y ROLES ================== */
  useEffect(() => {
    cargarRoles();
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAll();
      setUsuarios(data || []);
      setError("");
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Error al cargar usuarios";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (error) {
      console.error("Error cargando roles:", error);
      // No mostrar error de roles como error crítico
      // Se mostrará "Seleccionar..." en el dropdown
      setError(""); // No bloquear si roles falla
    }
  };

  /* ================== MANEJO FORM ================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingUser) {
        // Actualizar usuario existente
        await UserService.update(editingUser.id, form);
        alert("Usuario actualizado correctamente");
      } else {
        // Crear nuevo usuario
        await UserService.create(form);
        alert("Usuario creado correctamente");
      }

      // Limpiar formulario y recargar
      resetForm();
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      const apiMessage = error.response?.data?.error || error.response?.data?.message;
      const fallbackMessage = error.message || "Error al guardar usuario";
      const message = apiMessage || fallbackMessage;
      setError(message);
      alert("Error al guardar usuario: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setForm({
      firstName: usuario.firstName || "",
      lastName: usuario.lastName || "",
      email: usuario.email || "",
      documentType: usuario.documentType || "CC",
      documentNumber: usuario.documentNumber || "",
      roleId: usuario.role?.id || "",
      active: usuario.active !== undefined ? usuario.active : true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      setLoading(true);
      await UserService.delete(id);
      alert("Usuario eliminado correctamente");
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      documentType: "CC",
      documentNumber: "",
      roleId: "",
      active: true,
    });
  };

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
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

        {/* Mensaje de error global */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* ================= FORMULARIO ================= */}
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-text-primary-light dark:text-text-primary-dark">
            {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <Input
              label="Nombre"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Apellido"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />

            <Select
              label="Tipo de Documento"
              name="documentType"
              value={form.documentType}
              onChange={handleChange}
              options={[
                { value: "CC", label: "Cédula de Ciudadanía" },
                { value: "TI", label: "Tarjeta de Identidad" },
                { value: "CE", label: "Cédula de Extranjería" },
                { value: "PA", label: "Pasaporte" }
              ]}
              disabled={loading}
            />

            <Input
              label="Número de Documento"
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              disabled={loading}
              placeholder="Se usa como método de autenticación"
            />

            <Select
              label="Rol"
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              options={roles.map(r => ({ value: r.id, label: r.roleName || r.name }))}
              disabled={loading}
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <label className="text-sm font-semibold">Usuario Activo</label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-lg bg-surface-light dark:bg-surface-dark font-semibold"
                  disabled={loading}
                >
                  Cancelar Edición
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? "Guardando..." : editingUser ? "Actualizar Usuario" : "Crear Usuario"}
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
                  <th className="px-6 py-3">Nombre Completo</th>
                  <th className="px-6 py-3">Correo</th>
                  <th className="px-6 py-3">Documento</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      No hay usuarios registrados aún.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => {
                    // Encontrar el nombre del rol - puede venir como objeto con roleName
                    let roleName = 'Sin rol';
                    
                    // Si role es un objeto con roleName
                    if (u.role && typeof u.role === 'object' && u.role.roleName) {
                      roleName = u.role.roleName;
                    } 
                    // Si role es un ID numérico
                    else if (typeof u.role === 'number' && u.role !== 0) {
                      roleName = roles.find(r => r.id === u.role)?.roleName || 'Sin rol';
                    } 
                    // Si roleId existe
                    else if (u.roleId && typeof u.roleId === 'number') {
                      roleName = roles.find(r => r.id === u.roleId)?.roleName || 'Sin rol';
                    }
                    
                    return (
                    <tr
                      key={u.id}
                      className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {String(u.firstName || '')} {String(u.lastName || '')}
                      </td>
                      <td className="px-6 py-4">{String(u.email || '')}</td>
                      <td className="px-6 py-4">{String(u.documentNumber || 'N/A')}</td>
                      <td className="px-6 py-4">{String(roleName)}</td>
                      <td className="px-6 py-4">
                        <EstadoBadge estado={u.active ? "Activo" : "Inactivo"} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold"
                            disabled={loading}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold"
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
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

/* ================= COMPONENTES AUXILIARES ================= */

const Input = ({ label, type = "text", required = true, disabled = false, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <input
      type={type}
      {...props}
      className="input"
      required={required}
      disabled={disabled}
    />
  </div>
);

const Select = ({ label, options, disabled = false, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <select {...props} className="input" required disabled={disabled}>
      <option value="">Seleccionar...</option>
      {options.map((op) => (
        <option key={op.value || op} value={op.value || op}>
          {op.label || op}
        </option>
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