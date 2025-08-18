import axios from "axios";
import { toast } from "react-toastify";

//Createing axios instance
const api = axios.create({
  baseURL: process.env.API_URL,
});

//Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Unauthorized - Please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location = "/login";
      } else if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occured");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
