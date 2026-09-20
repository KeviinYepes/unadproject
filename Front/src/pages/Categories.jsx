import { useCallback, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import ResourceTable from "../components/ResourceTable";
import Toast from "../components/Toast";
import { Alert, Button, Input, Modal, PageHeader, Textarea } from "../components/ui";
import useResourceTable from "../hooks/useResourceTable";
import CategoryService from "../services/CategoryService";

const emptyForm = { categoryName: "", description: "" };

const columns = (onEdit, onDelete, busy) => [
  {
    key: "categoryName",
    label: "Categoría",
    render: (category) => (
      <span className="font-semibold text-fg">{category.categoryName || "Sin nombre"}</span>
    ),
  },
  {
    key: "description",
    label: "Descripción",
    render: (category) => (
      <span className="text-fg-muted">{category.description || "—"}</span>
    ),
  },
  {
    key: "actions",
    label: "Acciones",
    align: "right",
    render: (category) => (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          icon="edit"
          onClick={() => onEdit(category)}
          disabled={busy}
          aria-label={`Editar ${category.categoryName}`}
        >
          Editar
        </Button>
        <Button
          size="sm"
          variant="dangerSoft"
          icon="delete"
          onClick={() => onDelete(category)}
          disabled={busy}
          aria-label={`Eliminar ${category.categoryName}`}
        >
          Eliminar
        </Button>
      </div>
    ),
  },
];

export default function Categories() {
  const load = useCallback(() => CategoryService.getAll(), []);

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
  } = useResourceTable({ load, pageSize: 5, errorMessage: "Error al cargar categorías" });

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

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      categoryName: category.categoryName || "",
      description: category.description || "",
    });
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
        await CategoryService.update(editing.id, form);
        showToast("Categoría actualizada correctamente.");
      } else {
        await CategoryService.create(form);
        showToast("Categoría creada correctamente.");
      }

      closeModal();
      await refresh();
    } catch (requestError) {
      console.error(requestError);
      const message =
        requestError.response?.data?.error ||
        requestError.response?.data?.message ||
        requestError.message ||
        "Error al guardar la categoría";
      setError(message);
      showToast(`Error al guardar la categoría: ${message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete?.id) return;

    setSaving(true);

    try {
      await CategoryService.delete(toDelete.id);
      showToast("Categoría eliminada correctamente.");
      setToDelete(null);
      await refresh();
    } catch (requestError) {
      console.error(requestError);
      showToast(
        `Error al eliminar la categoría: ${
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
        title="Gestión de categorías"
        description="Las categorías agrupan el contenido y alimentan el filtro de la biblioteca."
        actions={
          <Button icon="add" onClick={openCreate} disabled={loading}>
            Agregar categoría
          </Button>
        }
      />

      {error && !isModalOpen && <Alert tone="danger">{error}</Alert>}

      <ResourceTable
        icon="category"
        title="Categorías registradas"
        subtitle={`${items.length} ${items.length === 1 ? "categoría" : "categorías"} en total`}
        columns={columns(openEdit, setToDelete, saving)}
        rows={pageItems}
        loading={loading}
        emptyIcon="category"
        emptyTitle="No hay categorías registradas"
        emptyDescription="Crea la primera categoría para poder clasificar el contenido de la biblioteca."
        emptyAction={
          <Button icon="add" onClick={openCreate}>
            Agregar categoría
          </Button>
        }
        page={page}
        totalItems={items.length}
        pageSize={5}
        onPageChange={changePage}
        itemLabel="categorías"
      />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        dismissible={!saving}
        icon={editing ? "edit" : "add_circle"}
        title={editing ? "Editar categoría" : "Crear nueva categoría"}
        subtitle="El nombre es el que verán los usuarios en el filtro de la biblioteca."
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="category-form" icon="save" loading={saving}>
              {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <Alert tone="danger">{error}</Alert>}

          <Input
            label="Nombre de la categoría"
            name="categoryName"
            value={form.categoryName}
            onChange={(event) =>
              setForm((current) => ({ ...current, categoryName: event.target.value }))
            }
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
            hint="Opcional."
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar categoría"
        message={`¿Seguro que quieres eliminar la categoría "${toDelete?.categoryName || ""}"?`}
        loading={saving}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
