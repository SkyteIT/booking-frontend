const TOKEN_KEY = "authToken";
const ALT_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const DEVICE_TOKEN_KEY = "deviceToken";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ALT_TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ALT_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ALT_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // deviceToken is intentionally left alone here - it's what lets this
  // browser skip the 2FA challenge on the *next* login (like WhatsApp Web
  // "remember this device"), so a plain logout must not clear it. Only an
  // explicit "forget this device" action should call removeDeviceToken.
}

// "Remember this device" - sent back on future logins so a recognized
// browser can skip the mandatory 2FA challenge until it expires server-side.
export function getDeviceToken(): string | null {
  return localStorage.getItem(DEVICE_TOKEN_KEY);
}

export function setDeviceToken(token: string) {
  localStorage.setItem(DEVICE_TOKEN_KEY, token);
}

export function removeDeviceToken() {
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}

export default {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeToken,
  getDeviceToken,
  setDeviceToken,
  removeDeviceToken,
};
