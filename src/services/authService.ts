// src/services/authService.ts
import api from "./api";
import tokenStorage from "./tokenStorage";

type AuthResponse = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: unknown;
  role?: string;
  email?: string;
};

const saveAuthToken = (response: AuthResponse) => {
  const token = response.token ?? response.accessToken;

  if (token) {
    tokenStorage.setToken(token);
  }
  if (response.refreshToken) {
    tokenStorage.setRefreshToken(response.refreshToken);
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
export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", {
    email,
  });

  return res.data;
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const res = await api.post("/auth/reset-password", {
    email,
    token,
    newPassword,
  });

  return res.data;
};

// Revokes the refresh token server-side. Best-effort — callers should clear
// local tokens regardless of whether this succeeds.
export const logout = async (refreshToken: string) => {
  await api.post("/auth/logout", { refreshToken });
};
