import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/authService";
import tokenStorage from "../services/tokenStorage";

export type AuthUser = {
  id?: string;
  userId?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  profileImageUrl?: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isVendor: boolean;
  vendorApplicationSubmitted: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  markVendorApplicationSubmitted: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const VENDOR_APPLICATION_STATUS_PREFIX = "vendorApplicationSubmitted";

function getVendorApplicationStorageKey(user: AuthUser | null) {
  const identifier = String(user?.userId ?? user?.id ?? user?.email ?? "guest").toLowerCase();
  return `${VENDOR_APPLICATION_STATUS_PREFIX}:${identifier}`;
}
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// Refresh scheduling: use httpOnly refresh cookie via /api/auth/refresh-token
function msUntilRefresh(token: string | null, refreshBeforeMs = 5 * 60 * 1000) {
  if (!token) return null;
  const decoded = parseJwt(token);
  const exp = decoded?.exp ? Number(decoded.exp) * 1000 : null;
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

    // schedule refresh
    refreshTimerRef.current = window.setTimeout(async () => {
      try {
        // call refresh endpoint using cookie (backend must set httpOnly refresh cookie on login)
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("refresh failed");

        const data = await res.json();
        const newToken = data?.token ?? data?.accessToken;
        if (newToken) {
          // update storage and reschedule
          tokenStorage.setToken(newToken);
          scheduleRefreshFromToken();
        } else {
          throw new Error("no token in refresh response");
        }
      } catch {
        tokenStorage.removeToken();
        setUser(null);
        try {
          window.location.href = "/login";
        } catch (_) {}
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
    cancelScheduledRefresh();
    tokenStorage.removeToken();
    setUser(null);
    setVendorApplicationSubmitted(false);
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

    const role =
      decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ?? decoded?.role;

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
}, []);

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
