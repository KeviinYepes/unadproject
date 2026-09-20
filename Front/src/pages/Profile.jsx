import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { Alert, Badge, Button, Card, CardHeader, Icon, Input, PageHeader } from "../components/ui";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import { buildDefaultPhoto, getPhotoKey, readStoredPhoto } from "../utils/profilePhoto";
import { logout } from "../utils/session";
import { normalizeRole, roleLabel, roleTone } from "../utils/role";

/** Nombre completo o el respaldo por defecto que espera `buildDefaultPhoto`. */
const fullName = (firstName, lastName) => [firstName, lastName].filter(Boolean).join(" ").trim();

const toProfileForm = (user, photo) => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
  documentType: user?.documentType || "",
  documentNumber: user?.documentNumber || "",
  roleName: user?.role?.roleName || "USER",
  photo: photo || buildDefaultPhoto(fullName(user?.firstName, user?.lastName)),
});

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentUser = AuthService.getCurrentUser();
  const photoKey = useMemo(() => getPhotoKey(currentUser?.userId), [currentUser?.userId]);
  const [savedProfile, setSavedProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const user = await UserService.getMe();
        const savedPhoto = readStoredPhoto(currentUser?.userId);
        const profile = toProfileForm(user, savedPhoto);
        setSavedProfile(profile);
        setForm(profile);
      } catch (requestError) {
        console.error("Error cargando perfil:", requestError);
        setError(
          requestError.response?.data?.error ||
            requestError.response?.data?.message ||
            "No se pudo cargar la información del perfil."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [photoKey]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form) return;

    try {
      setSaving(true);
      setError("");
      const updated = await UserService.updateMe(form);
      localStorage.setItem(photoKey, form.photo);
      window.dispatchEvent(new CustomEvent("profile-photo-changed"));

      const profile = toProfileForm(updated, form.photo);
      setSavedProfile(profile);
      setForm(profile);
      showToast("Perfil actualizado correctamente.");
    } catch (requestError) {
      console.error("Error guardando perfil:", requestError);
      const message =
        requestError.response?.data?.error ||
        requestError.response?.data?.message ||
        "No se pudo guardar el perfil.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!savedProfile) return;
    setForm(savedProfile);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Selecciona una imagen válida.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setForm((current) => ({
      ...current,
      photo: buildDefaultPhoto(fullName(current?.firstName, current?.lastName)),
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(normalizeRole(currentUser?.role) === "ADMIN" ? "/admin/dashboard" : "/main", {
      replace: true,
    });
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedProfile);
  const displayName = fullName(form?.firstName, form?.lastName);

  return (
    <div className="flex flex-col gap-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <PageHeader
        eyebrow="Cuenta"
        title="Editar Perfil"
        description="Administra tu información visible en la organización."
        actions={
          <>
            <Button variant="ghost" icon="arrow_back" onClick={handleBack}>
              Volver
            </Button>
            <Button variant="dangerSoft" icon="logout" onClick={() => logout(navigate)}>
              Cerrar sesión
            </Button>
          </>
        }
      />

      {loading ? (
        <Card>
          <p className="py-10 text-center text-sm text-fg-muted">Cargando perfil...</p>
        </Card>
      ) : !form ? (
        <Alert tone="danger" title="No se pudo cargar el perfil">
          {error}
        </Alert>
      ) : (
        <>
          {error && <Alert tone="danger">{error}</Alert>}

          <Card padded={false}>
            {/* Foto */}
            <div className="flex flex-col items-center gap-6 border-b border-line p-6 sm:flex-row sm:p-8">
              <div className="relative shrink-0">
                <div
                  className="size-28 rounded-full bg-subtle bg-cover bg-center shadow-card ring-4 ring-surface"
                  style={{ backgroundImage: `url(${form.photo})` }}
                  role="img"
                  aria-label="Foto de perfil"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Cambiar foto de perfil"
                  className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg shadow-card transition-transform hover:scale-105"
                >
                  <Icon name="photo_camera" size={18} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="text-lg font-extrabold text-fg">{displayName || "Usuario UNAD"}</h2>
                  <Badge tone={roleTone(form.roleName)}>{roleLabel(form.roleName)}</Badge>
                </div>
                <p className="mt-1 text-sm text-fg-muted">{form.email}</p>
                <p className="mt-3 text-xs text-fg-subtle">
                  La imagen se guarda localmente en este navegador.
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Button size="sm" icon="upload" onClick={() => fileInputRef.current?.click()}>
                    Cambiar Foto
                  </Button>
                  <Button size="sm" variant="outline" icon="restart_alt" onClick={handleRemovePhoto}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>

            {/* Datos */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <CardHeader
                icon="badge"
                title="Información personal"
                subtitle="Estos datos se muestran en tu perfil dentro de la plataforma."
              />

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Input
                  label="Nombre"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
                <Input
                  label="Apellido"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />

                <Input
                  label="Correo Electrónico"
                  value={form.email}
                  disabled
                  trailing={<Icon name="lock" size={16} className="text-fg-subtle" />}
                />
                <Input
                  label="Rol"
                  value={roleLabel(form.roleName)}
                  disabled
                  trailing={<Icon name="lock" size={16} className="text-fg-subtle" />}
                />

                <Input
                  label="Tipo de Documento"
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
                <Input
                  label="Número de Documento"
                  name="documentNumber"
                  value={form.documentNumber}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving || !isDirty}
                >
                  Cancelar
                </Button>

                <Button type="submit" icon="save" loading={saving} disabled={!isDirty}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
};

export default Profile;
