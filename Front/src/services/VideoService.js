import api from "../config/api";

const VideoService = {
  getAll: async () => {
    const response = await api.get("/api/content");
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  getById: async (id) => {
    const response = await api.get(`/api/content/${id}`);
    return response.data.data || response.data;
  },

  create: async (contentData) => {
    const payload = {
      urlVideo: contentData?.urlVideo,
      title: contentData?.title,
      description: contentData?.description,
      category: contentData?.categoryId ? { id: Number(contentData.categoryId) } : null,
      createdBy: contentData?.createdById ? { id: Number(contentData.createdById) } : null,
    };

    if (contentData?.materials?.length) {
      const formData = new FormData();
      formData.append("content", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      Array.from(contentData.materials).forEach((file) => {
        formData.append("materials", file);
      });

      const response = await api.post("/api/content", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data || response.data;
    }

    const response = await api.post("/api/content", payload);
    return response.data.data || response.data;
  },

  update: async (id, contentData) => {
    const payload = {
      urlVideo: contentData?.urlVideo,
      title: contentData?.title,
      description: contentData?.description,
      category: contentData?.categoryId ? { id: Number(contentData.categoryId) } : null,
      createdBy: contentData?.createdById ? { id: Number(contentData.createdById) } : null,
    };

    const response = await api.put(`/api/content/${id}`, payload);
    return response.data.data || response.data;
  },

  addMaterials: async (id, materials) => {
    const formData = new FormData();
    Array.from(materials || []).forEach((file) => {
      formData.append("materials", file);
    });

    const response = await api.post(`/api/content/${id}/materials`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data || response.data;
  },

  deleteMaterial: async (id, materialId) => {
    const response = await api.delete(`/api/content/${id}/materials/${materialId}`);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/content/${id}`);
    return response.data.data || response.data;
  },
};

export default VideoService;
