const TOKEN_KEY = "authToken";
const ALT_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getToken(): string | null {
  return (
    sessionStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(ALT_TOKEN_KEY)
  );
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ALT_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(refreshToken: string) {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ALT_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);

  // Remove tokens saved by the previous localStorage implementation
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ALT_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export default {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeToken,
};