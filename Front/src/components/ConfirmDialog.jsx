import Button from "./ui/Button";
import Modal from "./ui/Modal";

/**
 * Confirmacion de acciones destructivas.
 * Misma interfaz que antes; ahora reutiliza el modal comun, asi que hereda
 * cierre con Escape, bloqueo de scroll y el velo correcto en ambos temas.
 */
export default function ConfirmDialog({
  open,
  title = "Confirmar acción",
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      dismissible={!loading}
      size="sm"
      title={title}
      icon="warning"
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" icon="delete" loading={loading} onClick={onConfirm}>
            {loading ? "Eliminando..." : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-fg-muted">{message}</p>
      <p className="mt-3 text-xs font-semibold text-fg-subtle">Esta acción no se puede deshacer.</p>
    </Modal>
  );
}
