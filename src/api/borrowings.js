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
  createBorrowing: async (data) => {
    try {
      const response = await api.post("/borrowings", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getuserBorrowings: async (userId) => {
    try {
      const response = await api.get(`/borrowings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  returnBook: async (borrowingId) => {
    try {
      const response = await api.put(`/api/borrowings/${borrowingId}/return`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
