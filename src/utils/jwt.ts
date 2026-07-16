// JWT payloads are base64url-encoded (RFC 4648 §5): '-'/'_' instead of
// '+'/'/', and padding '=' stripped. atob() only understands standard
// base64, so tokens containing '-' or '_' fail to decode with it directly.
function base64UrlToBase64(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64.length % 4)) % 4;
  return base64 + "=".repeat(padding);
}

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(base64UrlToBase64(payload)));
  } catch {
    return null;
  }
}

export function getJwtExpiryMs(token: string): number | null {
  const decoded = parseJwt(token);
  const exp = decoded?.exp;
  return typeof exp === "number" ? exp * 1000 : null;
}
