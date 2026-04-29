import api from "../config/api";

const VideoStatsService = {
  getAll: async () => {
    const response = await api.get("/api/video-stats");
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  record: async ({ userId, contentId, watchTimeSeconds = 0, countView = false }) => {
    const response = await api.post("/api/content/stats/record", {
      userId,
      contentId,
      watchTimeSeconds,
      countView,
    });

    return response.data.data || response.data;
  },
};

export default VideoStatsService;
