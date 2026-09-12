// src/services/api.ts
import axios, { type AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./tokenRefresh";
import tokenStorage from "./tokenStorage";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRedirect?: boolean;
  }
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  skipAuthRedirect?: boolean;
}

const api = axios.create({
  baseURL: "/api", // Vite proxy forwards /api → VITE_API_BASE_URL (see vite.config.ts / .env)
  //headers: { "Content-Type": "application/json" },
});

const isPublicAuthRequest = (url = "") =>
  /\/(?:api\/)?auth\/(?:login|register|google-login|forgot-password|reset-password|verify-email|2fa\/(?:enroll\/start|enroll\/confirm|verify))(?:[?#]|$)/.test(url);

// Attach token to outgoing requests
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  const requestUrl = config.url ?? "";

  if (config.data instanceof FormData) {
    config.headers = config.headers ?? {};
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  if (token && !isPublicAuthRequest(requestUrl)) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: on 401, try refresh then retry original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (
      originalRequest &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isPublicAuthRequest(originalRequest.url) &&
      !originalRequest.skipAuthRedirect
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
