import api from "./axiosconfig";

export const dashboardApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("dashboard/admin-stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRecentActivity: async () => {
    const response = await api.get("dashboard/recent-activity");
    return response.data;
  },
};
