// src/services/authService.ts
import api from "./api";

type AuthResponse = {
  token?: string;
  accessToken?: string;
  user?: unknown;
  role?: string;
  email?: string;
};

const saveAuthToken = (response: AuthResponse) => {
  const token = response.token ?? response.accessToken;

  if (token) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("token", token);
  }
};

export const login = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/api/auth/login", { email, password });

  saveAuthToken(res.data);

  return res.data;
};

export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const res = await api.post<AuthResponse>("/api/auth/register", payload);

  saveAuthToken(res.data);

  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/api/auth/current-user");
  return res.data;
};