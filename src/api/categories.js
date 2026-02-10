import api from "./axiosconfig";

export const categoryApi = {
  getCategories: async () => {
    try {
      const res = await api.get("/categories");
      return res.data;
    } catch (error) {
      return error;
    }
  },

  createCategory: async (data) => {
    try {
      const res = await api.post("/categories", data);
      return res.data;
    } catch (error) {
      return error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const res = await api.put(`/categories/${id}`, data);
      return res.data;
    } catch (error) {
      return error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    } catch (error) {
      return error;
    }
  },
};
