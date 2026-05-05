import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/authService";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorApplicationSubmitted, setVendorApplicationSubmitted] = useState(false);



  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    setUser(null);
    setVendorApplicationSubmitted(false);
  }, []);
  const refreshUser = useCallback(async () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  if (!token) {
    setUser(null);
    setLoading(false);
    return null;
  }

  try {
    setLoading(true);

    // 🔹 Get user from API
    const currentUser = (await getCurrentUser()) as AuthUser;

    // 🔥 Decode JWT to get role
    const decoded = parseJwt(token);

    const role =
      decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ?? decoded?.role;

    // 🔥 Merge role into user
    setUser({
      ...currentUser,
      role: role,
    });

    return {
      ...currentUser,
      role,
    };
  } catch {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
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
