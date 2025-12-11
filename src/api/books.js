import api from "./axiosconfig";

export const bookApi = {
  addBook: async (data) => {
    try {
      const response = await api.post("/books", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getBooks: async (data) => {
    try {
      const response = await api.get("/books", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateBook: async (id, data) => {
    try {
      const response = await api.put(`/books/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteBook: async (id, data) => {
    try {
      const response = await api.delete(`/books/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
