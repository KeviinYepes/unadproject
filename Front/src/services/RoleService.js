import api from "../config/api";

const RoleService = {
  /**
   * Lista todos los roles
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get("/api/roles");
    const roles = Array.isArray(response.data?.data) ? response.data.data : [];
    return roles;
  },

  /**
   * Obtiene un rol por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/api/roles/${id}`);
    return response.data;
  },

  /**
   * Busca un rol por nombre
   * @param {string} name
   * @returns {Promise<Object>}
   */
  searchByName: async (name) => {
    const response = await api.get(`/api/roles/search?name=${name}`);
    return response.data;
  },

  /**
   * Verifica si existe un rol por nombre
   * @param {string} name
   * @returns {Promise<boolean>}
   */
  existsByName: async (name) => {
    const response = await api.get(`/api/roles/exists?name=${name}`);
    return response.data;
  },

  /**
   * Crea un nuevo rol (requiere rol ADMIN)
   * @param {Object} roleData
   * @returns {Promise<Object>}
   */
  create: async (roleData) => {
    const response = await api.post("/api/roles", roleData);
    return response.data.data || response.data;
  },

  /**
   * Actualiza un rol existente (requiere rol ADMIN)
   * @param {number} id
   * @param {Object} roleData
   * @returns {Promise<Object>}
   */
  update: async (id, roleData) => {
    const response = await api.put(`/api/roles/${id}`, roleData);
    return response.data;
  },

  /**
   * Elimina un rol (requiere rol ADMIN)
   * @param {number} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const response = await api.delete(`/api/roles/${id}`);
    return response.data;
  },
};

export default RoleService;
