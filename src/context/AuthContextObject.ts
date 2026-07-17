import { createContext } from "react";

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

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isVendor: boolean;
  vendorApplicationSubmitted: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  markVendorApplicationSubmitted: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
