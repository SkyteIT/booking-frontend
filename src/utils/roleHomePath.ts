// Single source of truth for "where does this role land after login" -
// used by RoleGate and both 2FA pages, so a role's real home page is
// never hardcoded more than once.
export function getRoleHomePath(role: string): string {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "superadmin") return "/admin/dashboard";
  if (normalizedRole === "admin") return "/admin/dashboard";
  // Finance can't reach the Admin-only dashboard - Disputes & Refunds is
  // the first real page their role can actually load.
  if (normalizedRole === "finance") return "/admin/disputes";
  if (normalizedRole === "vendor") return "/vendor/dashboard";
  if (normalizedRole === "customer" || normalizedRole === "user") return "/";

  return "/";
}
