import axios from "axios";
import qs from "qs";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,

  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat",  
      skipNulls: true,
    }),
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                          originalRequest.url?.includes('/auth/register') ||
                          originalRequest.url?.includes('/auth/refresh') ||
                          originalRequest.url?.includes('/auth/reset-password');

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (err) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);