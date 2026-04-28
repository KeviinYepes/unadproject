import api from "../config/api";

const CategoryService = {
  getAll: async () => {
    const response = await api.get("/api/categories");
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  getById: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data.data || response.data;
  },

  searchByName: async (name) => {
    const response = await api.get(`/api/categories/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  existsByName: async (name) => {
    const response = await api.get(`/api/categories/exists?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  create: async (categoryData) => {
    const payload = {
      categoryName: categoryData?.categoryName,
      description: categoryData?.description,
    };

    const response = await api.post("/api/categories", payload);
    return response.data.data || response.data;
  },

  update: async (id, categoryData) => {
    const payload = {
      categoryName: categoryData?.categoryName,
      description: categoryData?.description,
    };

    const response = await api.put(`/api/categories/${id}`, payload);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data.data || response.data;
  },
};

export default CategoryService;
