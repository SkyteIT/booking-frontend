const TOKEN_KEY = "authToken";
const ALT_TOKEN_KEY = "token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ALT_TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ALT_TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ALT_TOKEN_KEY);
}

export default { getToken, setToken, removeToken };
