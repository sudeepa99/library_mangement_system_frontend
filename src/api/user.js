import api from "./axiosconfig";

export const userApi = {
  getAllUsers: async (data) => {
    try {
      const response = await api.get("/users", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (id, data) => {
    try {
      const response = await api.delete(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
