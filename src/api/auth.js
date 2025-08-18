import api from "./axiosconfig";

export const authApi = {
  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      return response;
    } catch (error) {
      return error;
    }
  },
};
