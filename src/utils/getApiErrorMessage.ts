import { isAxiosError } from "axios";

// Extracts a human-readable message from an axios error response (the
// backend returns either a plain string or a {message}/{error} object),
// falling back to a caller-supplied default for anything else.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data;
  if (!data) return error.message || fallback;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    return (
      (data as { message?: string; error?: string }).message ??
      (data as { message?: string; error?: string }).error ??
      fallback
    );
  }
  return fallback;
};
