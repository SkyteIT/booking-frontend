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
  // Set only when a 2FA challenge is pending (Admin/Finance roles) - no
  // real tokens are issued in that case, so saveAuthToken is a no-op.
  requiresTwoFactor?: boolean;
  requiresEnrollment?: boolean;
  challengeToken?: string;
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

// Always resolves with the same generic backend message, regardless of
// whether the email is registered — never used to tell the user whether
// their account exists.
export const requestPasswordReset = async (email: string) => {
  const res = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await api.post<{ message: string }>("/auth/reset-password", { token, newPassword });
  return res.data;
};

// Backend takes the token as a query param, not a body field.
export const verifyEmail = async (token: string) => {
  const res = await api.post<{ message: string }>("/auth/verify-email", null, {
    params: { token },
  });
  return res.data;
};

// Revokes the refresh token server-side. Best-effort — callers should clear
// local tokens regardless of whether this succeeds.
export const logout = async (refreshToken: string) => {
  await api.post("/auth/logout", { refreshToken });
};

export interface TwoFactorEnrollmentStart {
  secret: string;
  otpAuthUri: string;
}

export const startTwoFactorEnrollment = async (challengeToken: string) => {
  const res = await api.post<TwoFactorEnrollmentStart>("/auth/2fa/enroll/start", { challengeToken });
  return res.data;
};

export interface TwoFactorEnrollmentResult {
  auth: AuthResponse;
  backupCodes: string[];
}

export const confirmTwoFactorEnrollment = async (challengeToken: string, code: string) => {
  const res = await api.post<TwoFactorEnrollmentResult>("/auth/2fa/enroll/confirm", { challengeToken, code });
  saveAuthToken(res.data.auth);
  return res.data;
};

export const verifyTwoFactorCode = async (challengeToken: string, code: string) => {
  const res = await api.post<AuthResponse>("/auth/2fa/verify", { challengeToken, code });
  saveAuthToken(res.data);
  return res.data;
};
