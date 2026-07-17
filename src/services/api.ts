import axios from "axios";
import { refreshAccessToken } from "./tokenRefresh";
import tokenStorage from "./tokenStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // send/receive cookies (httpOnly refresh token)
});

// Attach token to outgoing requests
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  const requestUrl = config.url ?? "";
  const isPublicAuthRequest = /\/api\/auth\/(login|register)/.test(requestUrl);

  if (token && !isPublicAuthRequest) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: on 401, try refresh then retry original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        // update header and retry original request
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // refresh failed — tokens already cleared by refreshAccessToken()
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
