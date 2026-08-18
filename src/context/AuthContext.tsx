
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useContext
} from "react";
import { getCurrentUser, logout as logoutApi } from "../services/authService";
import { refreshAccessToken } from "../services/tokenRefresh";
import tokenStorage from "../services/tokenStorage";
import { getJwtExpiryMs, parseJwt } from "../utils/jwt";
import { AuthContext } from "./AuthContextObject";
import type { AuthContextValue, AuthUser } from "./AuthContextObject";

const VENDOR_APPLICATION_STATUS_PREFIX = "vendorApplicationSubmitted";

function getVendorApplicationStorageKey(user: AuthUser | null) {
  const identifier = String(user?.userId ?? user?.id ?? user?.email ?? "guest").toLowerCase();
  return `${VENDOR_APPLICATION_STATUS_PREFIX}:${identifier}`;
}
// Refresh scheduling: use httpOnly refresh cookie via /api/auth/refresh-token
function msUntilRefresh(token: string | null, refreshBeforeMs = 5 * 60 * 1000) {
  if (!token) return null;
  const exp = getJwtExpiryMs(token);
  if (!exp) return null;

  const now = Date.now();
  const ms = exp - now - refreshBeforeMs;
  return ms > 0 ? ms : 0;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorApplicationSubmitted, setVendorApplicationSubmitted] = useState(false);

  const refreshTimerRef = useRef<number | null>(null);

  const scheduleRefreshFromToken = useCallback(() => {
    const token = tokenStorage.getToken();
    const ms = msUntilRefresh(token);

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (ms === null) return;

    // schedule refresh; routed through the shared refreshAccessToken() so
    // this proactive timer and the axios 401 interceptor never race two
    // concurrent refresh calls against a token-rotating backend
    refreshTimerRef.current = window.setTimeout(async () => {
      const newToken = await refreshAccessToken();

      if (newToken) {
        scheduleRefreshFromToken();
      } else {
        setUser(null);
        window.location.href = "/login";
      }
    }, ms);
  }, []);

  const cancelScheduledRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);



  const logout = useCallback(() => {
    const refreshToken = tokenStorage.getRefreshToken();
  
    cancelScheduledRefresh();
  
    // Clear authentication
    tokenStorage.removeToken();
    setUser(null);
  
    // Clear unfinished vendor application
    localStorage.removeItem("vendor_application");
  
    // Clear submitted-status flag for the current user
    setVendorApplicationSubmitted(false);
  
    // Best-effort server-side refresh-token revocation
    if (refreshToken) {
      logoutApi(refreshToken).catch(() => {});
    }
  }, [cancelScheduledRefresh]);
  const refreshUser = useCallback(async () => {
  const token = tokenStorage.getToken();

  if (!token) {
    setUser(null);
    setLoading(false);
    return null;
  }

  try {
    setLoading(true);

    // Get user from API
    const currentUser = (await getCurrentUser()) as AuthUser;

    // Decode JWT to get role
    const decoded = parseJwt(token);

    const role = String(
      decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ??
        decoded?.role ??
        ""
    );

    // Merge role into user
    setUser({
      ...currentUser,
      role: role,
    });

    // schedule token refresh based on decoded exp
    scheduleRefreshFromToken();

    return {
      ...currentUser,
      role,
    };
    } catch {
      tokenStorage.removeToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
}, [scheduleRefreshFromToken]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) {
      setVendorApplicationSubmitted(false);
      return;
    }

    const key = getVendorApplicationStorageKey(user);
    setVendorApplicationSubmitted(localStorage.getItem(key) === "true");
  }, [user]);

  const markVendorApplicationSubmitted = useCallback(() => {
    if (!user) {
      return;
    }

    const key = getVendorApplicationStorageKey(user);
    localStorage.setItem(key, "true");
    setVendorApplicationSubmitted(true);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isVendor: String(user?.role ?? "").toLowerCase() === "vendor",
      vendorApplicationSubmitted,
      refreshUser,
      markVendorApplicationSubmitted,
      logout,
    }),
    [loading, logout, markVendorApplicationSubmitted, refreshUser, user, vendorApplicationSubmitted]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
