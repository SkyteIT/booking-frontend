import type { ZodError } from "zod";

export function zodErrorToFieldErrors(err: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  err.issues.forEach((issue) => {
    const key = issue.path[0]?.toString() || "_error";
    if (!out[key]) out[key] = issue.message;
  });
  return out;
}
