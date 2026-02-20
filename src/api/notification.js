import api from "./axiosconfig";

export const notificationApi = {
  sendOverdueReminder: async (userId, bookId) => {
    try {
      const response = await api.post("/notifications/overdue", {
        userId,
        bookId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
