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
  sendOTPCode: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password/send-code", email);
      return response;
    } catch (error) {
      throw error;
    }
  },
  verifyCode: async (email, code) => {
    try {
      const response = await api.post(
        "/auth/forgot-password/verify-code",
        email,
        code,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
