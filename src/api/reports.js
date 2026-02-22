import api from "./axiosconfig";

export const reportsApi = {
  getBorrowingTrends: async (params) => {
    try {
      const response = await api.get("/reports/borrowing-trends", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getKeyMetrics: async (params) => {
    try {
      const response = await api.get("/reports/key-metrics", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAnalyticsReport: async () => {
    try {
      const response = await api.get("/reports/analytics");
      return response;
    } catch (error) {
      throw error;
    }
  },
};
