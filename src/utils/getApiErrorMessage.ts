import { isAxiosError } from "axios";

// Extracts a human-readable message from an axios error response (the
// backend returns either a plain string or a {message}/{error} object),
// falling back to a caller-supplied default for anything else.
//
// Deliberately never surfaces error.message or a raw JSON dump of the
// response body - axios's own error.message is a wire-level string like
// "Request failed with status code 500", and an un-parsed response body
// can carry a stack trace or exception type on an unhandled server error.
// Only a message the backend explicitly meant for end users (its
// {message}/{error} field) is ever shown; anything else falls back to
// the caller-supplied default.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data;
  if (!data) return fallback;
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
