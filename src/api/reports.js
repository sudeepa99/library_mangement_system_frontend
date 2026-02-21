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
};
