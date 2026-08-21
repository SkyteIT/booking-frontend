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
  // Only set right after a "remember this device" 2FA verification.
  deviceToken?: string;
};

const saveAuthToken = (response: AuthResponse) => {
  const token = response.token ?? response.accessToken;

  if (token) {
    tokenStorage.setToken(token);
  }
  if (response.refreshToken) {
    tokenStorage.setRefreshToken(response.refreshToken);
  }
  if (response.deviceToken) {
    tokenStorage.setDeviceToken(response.deviceToken);
  }
};

export const login = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
    deviceToken: tokenStorage.getDeviceToken(),
  });

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

  return res.data;
};

export const loginWithGoogle = async (credential: string) => {
  const res = await api.post<AuthResponse>("/auth/google-login", {
    idToken: credential,
    deviceToken: tokenStorage.getDeviceToken(),
  });

  saveAuthToken(res.data);

  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/current-user");
  return res.data;
};
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const res = await api.put("/auth/profile", payload);
  return res.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("File", file);
  const res = await api.post("/auth/profile/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Self-service — works for any authenticated role. Doesn't take effect
// until the confirmation link sent to newEmail is clicked; no approval
// step, unlike the staff-only EmailChangeRequest flow used in the admin
// portal.
export const requestEmailChange = async (newEmail: string) => {
  const res = await api.post<{ message: string }>("/auth/email/change-request", { newEmail });
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
    skipAuthRedirect: true,
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

export const confirmTwoFactorEnrollment = async (
  challengeToken: string,
  code: string,
  rememberDevice = false,
) => {
  const res = await api.post<TwoFactorEnrollmentResult>("/auth/2fa/enroll/confirm", {
    challengeToken,
    code,
    rememberDevice,
  });
  saveAuthToken(res.data.auth);
  return res.data;
};

export const verifyTwoFactorCode = async (
  challengeToken: string,
  code: string,
  rememberDevice = false,
) => {
  const res = await api.post<AuthResponse>("/auth/2fa/verify", {
    challengeToken,
    code,
    rememberDevice,
  });
  saveAuthToken(res.data);
  return res.data;
};

// Self-service opt-in 2FA - for an already-logged-in user on a role where
// 2FA isn't mandatory, driven by the current session (no challenge token).
export const startSelfServiceTwoFactorEnrollment = async () => {
  const res = await api.post<TwoFactorEnrollmentStart>("/auth/2fa/self-enroll/start");
  return res.data;
};

export const confirmSelfServiceTwoFactorEnrollment = async (code: string) => {
  const res = await api.post<string[]>("/auth/2fa/self-enroll/confirm", { code });
  return res.data;
};

export const disableTwoFactor = async (currentPassword: string) => {
  await api.post("/auth/2fa/disable", { currentPassword });
};
