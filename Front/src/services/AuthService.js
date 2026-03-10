import api from "../config/api";

const AuthService = {
  /**
   * Inicia sesión con credenciales
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Datos de login con token y usuario
   */
  login: async (credentials) => {
    try {
      const response = await api.post("/api/auth/login", credentials);

      // El backend devuelve: { code, status, message, data: { token, tokenType, role, userId } }
      const loginData = response.data.data || response.data;
      const { token, role, userId } = loginData;

      // Guardar token y datos del usuario en localStorage
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({ role, userId, email: credentials.email })
        );
      }

      return loginData;
    } catch (error) {
      // Manejar errores de ApiResponse
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al iniciar sesión";
      throw { message: errorMessage };
    }
  },

  /**
   * Cierra sesión del usuario actual
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Obtiene el usuario actual desde localStorage
   * @returns {Object|null} Datos del usuario o null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verifica si hay una sesión activa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Obtiene el token actual
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default AuthService;
