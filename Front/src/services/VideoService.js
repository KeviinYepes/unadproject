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

  delete: async (id) => {
    const response = await api.delete(`/api/content/${id}`);
    return response.data.data || response.data;
  },
};

export default VideoService;
