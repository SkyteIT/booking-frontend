import axios from "axios";
import tokenStorage from "./tokenStorage";

// Single in-flight refresh promise shared by every caller (the axios 401
// interceptor and AuthContext's proactive timer) so concurrent callers
// await the same request instead of racing separate POSTs against a
// backend that may rotate the refresh token on use.
let inFlightRefresh: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    tokenStorage.removeToken();
    return null;
  }

  try {
    const refreshUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`;
    const res = await axios.post(refreshUrl, { refreshToken });
    const newToken = res?.data?.token ?? res?.data?.accessToken;

    if (!newToken) {
      tokenStorage.removeToken();
      return null;
    }

    tokenStorage.setToken(newToken);
    // Backend rotates the refresh token on every use — the old one is
    // revoked, so the new one must be stored or the next refresh fails.
    if (res?.data?.refreshToken) {
      tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return newToken;
  } catch {
    tokenStorage.removeToken();
    return null;
  }
}

export function refreshAccessToken(): Promise<string | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = doRefresh().finally(() => {
      inFlightRefresh = null;
    });
  }

  return inFlightRefresh;
}
