import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { Alert, Button, Icon, Input, Modal } from "../components/ui";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    documentNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverError, setRecoverError] = useState("");
  const [recoverForm, setRecoverForm] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleRecoverChange = (e) => {
    setRecoverForm({
      ...recoverForm,
      [e.target.name]: e.target.value,
    });
    setRecoverError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthService.login(formData);
      navigate("/main");
    } catch (err) {
      console.error("Error de login:", err);
      setError(err.message || "Credenciales inválidas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const openRecoverModal = () => {
    setRecoverForm({
      email: formData.email,
    });
    setRecoverError("");
    setIsRecoverOpen(true);
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    setRecoverLoading(true);
    setRecoverError("");

    try {
      await AuthService.recoverPassword(recoverForm);
      setFormData((current) => ({
        ...current,
        email: recoverForm.email,
      }));
      setSuccess("Te enviamos las instrucciones al correo registrado.");
      setIsRecoverOpen(false);
    } catch (err) {
      setRecoverError(err.message || "No se pudo enviar el correo de recuperación.");
    } finally {
      setRecoverLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca (solo escritorio) */}
      <aside className="relative hidden overflow-hidden bg-brand p-10 text-brand-fg lg:flex lg:flex-col lg:justify-end">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-brand/70" aria-hidden="true" />

        <div className="relative flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Icon name="play_circle" size={26} filled />
          </span>
          <span>
            <span className="block text-base font-extrabold leading-tight">Guías Visuales</span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-white/75">
              UNAD
            </span>
          </span>
        </div>

        <div className="relative mt-8 max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight">
            Formación de procesos en minutos
          </h1>
          <p className="mt-4 text-base leading-7 text-white/85">
            Accede a guías y recursos multimedia para el correcto diligenciamiento de los
            formularios internos.
          </p>
        </div>
      </aside>

      {/* Formulario */}
      <main className="relative flex flex-col justify-center bg-canvas px-5 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Marca compacta para movil */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand text-brand-fg">
              <Icon name="play_circle" size={24} filled />
            </span>
            <span>
              <span className="block text-sm font-extrabold leading-tight text-fg">
                Guías Visuales
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                UNAD
              </span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-fg">Acceso a la plataforma</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Ingresa para continuar aprendiendo y completar tus procesos con éxito.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {error && <Alert tone="danger">{error}</Alert>}
            {success && <Alert tone="success">{success}</Alert>}

            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              icon="mail"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <Input
              label="Número de Documento"
              name="documentNumber"
              type={showPassword ? "text" : "password"}
              icon="lock"
              placeholder="Tu número de documento"
              value={formData.documentNumber}
              onChange={handleChange}
              disabled={loading}
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar documento" : "Mostrar documento"}
                  className="flex size-8 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-subtle hover:text-fg"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} size={18} />
                </button>
              }
            />

            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <button
              type="button"
              onClick={openRecoverModal}
              className="self-center text-sm font-semibold text-fg-muted hover:text-brand-ink hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>

          <div className="mt-10 border-t border-line pt-6 text-center text-xs text-fg-subtle">
            <p>© {new Date().getFullYear()} Guías Visuales UNAD · Simplificando tus trámites.</p>
            <p className="mt-1">
              ¿Necesitas ayuda con un formulario específico?{" "}
              <a href="#" className="font-semibold text-brand-ink hover:underline">
                Contactar a un experto
              </a>
            </p>
          </div>
        </div>
      </main>

      <Modal
        open={isRecoverOpen}
        onClose={() => setIsRecoverOpen(false)}
        dismissible={!recoverLoading}
        size="sm"
        icon="key"
        title="Recuperar contraseña"
        subtitle="Escribe tu correo registrado y enviaremos instrucciones de recuperación."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsRecoverOpen(false)}
              disabled={recoverLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" form="recover-form" icon="send" loading={recoverLoading}>
              {recoverLoading ? "Enviando..." : "Enviar instrucciones"}
            </Button>
          </>
        }
      >
        <form id="recover-form" onSubmit={handleRecoverSubmit} className="flex flex-col gap-4">
          {recoverError && <Alert tone="danger">{recoverError}</Alert>}

          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            icon="mail"
            value={recoverForm.email}
            onChange={handleRecoverChange}
            disabled={recoverLoading}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
