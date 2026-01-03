import api from "./axiosconfig";

export const authApi = {
  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      console.log("Response", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
