import api from "./axiosconfig";

export const borrowingApi = {
  getBorrowings: async (data) => {
    try {
      const response = await api.get("/borrowings", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
