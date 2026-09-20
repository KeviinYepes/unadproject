import { useCallback, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import ResourceTable from "../components/ResourceTable";
import Toast from "../components/Toast";
import { Alert, Badge, Button, Input, Modal, PageHeader, Textarea } from "../components/ui";
import useResourceTable from "../hooks/useResourceTable";
import RoleService from "../services/RoleService";

const emptyForm = { roleName: "", description: "" };

const columns = (onEdit, onDelete, busy) => [
  {
    key: "roleName",
    label: "Rol",
    render: (role) => <Badge tone="brand">{role.roleName || "Sin nombre"}</Badge>,
  },
  {
    key: "description",
    label: "Descripción",
    render: (role) => <span className="text-fg-muted">{role.description || "—"}</span>,
  },
  {
    key: "actions",
    label: "Acciones",
    align: "right",
    render: (role) => (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          icon="edit"
          onClick={() => onEdit(role)}
          disabled={busy}
          aria-label={`Editar ${role.roleName}`}
        >
          Editar
        </Button>
        <Button
          size="sm"
          variant="dangerSoft"
          icon="delete"
          onClick={() => onDelete(role)}
          disabled={busy}
          aria-label={`Eliminar ${role.roleName}`}
        >
          Eliminar
        </Button>
      </div>
    ),
  },
];

export default function Roles() {
  const load = useCallback(() => RoleService.getAll(), []);

  const {
    items,
    pageItems,
    loading,
    error,
    setError,
    page,
    changePage,
    toast,
    showToast,
    dismissToast,
    refresh,
  } = useResourceTable({ load, pageSize: 5, errorMessage: "Error al cargar roles" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (role) => {
    setEditing(role);
    setForm({ roleName: role.roleName || "", description: role.description || "" });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editing) {
        await RoleService.update(editing.id, form);
        showToast("Rol actualizado correctamente.");
      } else {
        await RoleService.create(form);
        showToast("Rol creado correctamente.");
      }

      closeModal();
      await refresh();
    } catch (requestError) {
      console.error(requestError);
      const message =
        requestError.response?.data?.error ||
        requestError.response?.data?.message ||
        requestError.message ||
        "Error al guardar el rol";
      setError(message);
      showToast(`Error al guardar el rol: ${message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete?.id) return;

    setSaving(true);

    try {
      await RoleService.delete(toDelete.id);
      showToast("Rol eliminado correctamente.");
      setToDelete(null);
      await refresh();
    } catch (requestError) {
      console.error(requestError);
      showToast(
        `Error al eliminar el rol: ${
          requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          requestError.message
        }`,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Toast message={toast?.message} type={toast?.type} onClose={dismissToast} />

      <PageHeader
        eyebrow="Administración"
        title="Gestión de roles"
        description="Los roles determinan qué pantallas y acciones tiene disponibles cada usuario."
        actions={
          <Button icon="add" onClick={openCreate} disabled={loading}>
            Agregar rol
          </Button>
        }
      />

      {error && !isModalOpen && <Alert tone="danger">{error}</Alert>}

      <ResourceTable
        icon="admin_panel_settings"
        title="Roles registrados"
        subtitle={`${items.length} ${items.length === 1 ? "rol" : "roles"} en total`}
        columns={columns(openEdit, setToDelete, saving)}
        rows={pageItems}
        loading={loading}
        emptyIcon="admin_panel_settings"
        emptyTitle="No hay roles registrados"
        emptyDescription="Crea el primer rol para poder asignar permisos a los usuarios."
        emptyAction={
          <Button icon="add" onClick={openCreate}>
            Agregar rol
          </Button>
        }
        page={page}
        totalItems={items.length}
        pageSize={5}
        onPageChange={changePage}
        itemLabel="roles"
      />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        dismissible={!saving}
        icon={editing ? "edit" : "add_circle"}
        title={editing ? "Editar rol" : "Crear nuevo rol"}
        subtitle="Usa nombres cortos y en mayúsculas, por ejemplo ADMIN o MODERATOR."
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="role-form" icon="save" loading={saving}>
              {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
            </Button>
          </>
        }
      >
        <form id="role-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <Alert tone="danger">{error}</Alert>}

          <Input
            label="Nombre del rol"
            name="roleName"
            value={form.roleName}
            onChange={(event) => setForm((current) => ({ ...current, roleName: event.target.value }))}
            disabled={saving}
            required
          />

          <Textarea
            label="Descripción"
            name="description"
            rows={3}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            disabled={saving}
            hint="Opcional. Ayuda a recordar para qué sirve el rol."
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar rol"
        message={`¿Seguro que quieres eliminar el rol "${toDelete?.roleName || ""}"? Los usuarios que lo tengan quedarán sin rol asignado.`}
        loading={saving}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
