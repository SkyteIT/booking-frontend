// src/services/authService.ts
import api from "./api";
import tokenStorage from "./tokenStorage";

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
    tokenStorage.setToken(token);
  }
};

export const login = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });

  saveAuthToken(res.data);

  return res.data;
};

export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const res = await api.post<AuthResponse>("/auth/register", {
    ...payload,
    name: `${payload.firstName} ${payload.lastName}`,
  });

  saveAuthToken(res.data);

  return res.data;
};

export const loginWithGoogle = async (credential: string) => {
  const res = await api.post<AuthResponse>("/auth/google-login", { idToken: credential });

  saveAuthToken(res.data);

  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/current-user");
  return res.data;
};
